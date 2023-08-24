package zatti.alexandre.backend.service;

import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zatti.alexandre.backend.dto.*;
import zatti.alexandre.backend.model.Causa;
import zatti.alexandre.backend.model.Consequencia;
import zatti.alexandre.backend.utils.MatrizImpacto;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class OntologyService {

    private final Dataset dataset;
    private final Model model;

    @Autowired
    public OntologyService(Dataset dataset, Model model) {
        this.dataset = dataset;
        this.model = model;
    }

    public boolean loadRdfData(String rdfContent) {
        try {
            // Clearing existing data
            dataset.getDefaultModel().removeAll();

            model.read(new StringReader(rdfContent), null,
                       "RDF/XML"); // Specify the correct RDF language
            dataset.getDefaultModel().add(model);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<FaseEngenhariaConsequenciasResponseDTO> getConsequenciasByFaseEngenharia() {
        var queryString =
                """
                        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                                
                        SELECT ?nomeFase (?fase AS ?uriFase) ?nomeConsequencia ?descricaoConsequencia (?evidenciadaPor AS ?uriConsequencia)
                        WHERE {
                          ?fase rdf:type <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#FaseEngenhariaRequisitos> .
                          ?fase <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeFase .
                          ?fase <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#eEvidenciadaPor> ?evidenciadaPor .
                          ?evidenciadaPor rdf:type <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#ConsequenciaReD> .
                          ?evidenciadaPor <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeConsequencia .
                          ?evidenciadaPor <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?descricaoConsequencia .
                        }
                        """;

        var query = QueryFactory.create(queryString);

        List<FaseEngenhariaConsequenciasResponseDTO> resultList = new ArrayList<>();

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            var results = qe.execSelect();
            while (results.hasNext()) {
                var solution = results.next();

                int foundPreviousFaseEngenhariaIndex =
                        isFaseEngenhariaAlreadyPresent(resultList, solution.get("nomeFase").toString());

                if (foundPreviousFaseEngenhariaIndex != -1) {
                    var faseEngenharia = resultList.get(foundPreviousFaseEngenhariaIndex);
                    faseEngenharia.addFaseEngenhariaConsequencia(new Consequencia(
                            solution.get("nomeConsequencia").toString(),
                            solution.get("uriConsequencia").toString(),
                            solution.get("descricaoConsequencia").toString()));
                    resultList.set(foundPreviousFaseEngenhariaIndex, faseEngenharia);
                    continue;
                }

                var faseEngenharia = new FaseEngenhariaConsequenciasResponseDTO(solution.get("nomeFase").toString(),
                                                                                solution.get("uriFase").toString());
                faseEngenharia.addFaseEngenhariaConsequencia(
                        new Consequencia(solution.get("nomeConsequencia").toString(),
                                         solution.get("uriConsequencia").toString(),
                                         solution.get("descricaoConsequencia").toString()));

                resultList.add(faseEngenharia);
            }
        }

        return resultList;
    }

    private int isFaseEngenhariaAlreadyPresent(
            List<FaseEngenhariaConsequenciasResponseDTO> list, String name) {
        for (int i = 0; i < list.size(); i++) {
            var item = list.get(i);
            if (item.getFaseEngenhariaNome().equals(name)) {
                return i;
            }
        }
        return -1;
    }

    public List<ConsequenciaCausasResponseDTO> getCausasByConsequencia(
            List<ConsequenciaCausasRequestDTO> consequencias) {

        var listaCausasConsequencias = new ArrayList<ConsequenciaCausasResponseDTO>();

        for (int i = 0; i < consequencias.size(); i++) {
            var consequencia = consequencias.get(i);
            var queryString = getCausaByConsequenciaQuery(consequencia);
            var query = QueryFactory.create(queryString);
            var causaConsequencia = new ConsequenciaCausasResponseDTO(consequencia.getConsequenciaUri(),
                                                                      consequencia.getConsequenciaNome());

            try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
                ResultSet results = qe.execSelect();
                while (results.hasNext()) {
                    QuerySolution solution = results.next();
                    causaConsequencia.addCausa(new Causa(solution.get("nomeCausa").toString(),
                                                         solution.get("uriCausa").toString(),
                                                         solution.get("descricaoCausa").toString()));
                }

            }

            listaCausasConsequencias.add(causaConsequencia);
        }

        return listaCausasConsequencias;
    }

    private String getCausaByConsequenciaQuery(ConsequenciaCausasRequestDTO consequencia) {

        return "SELECT ?nomeConsequencia ?uriCausa ?nomeCausa ?descricaoCausa " +
               "WHERE {" +
               "    " + consequencia.getConsequenciaUri() + " <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeConsequencia ." +
               "    " + consequencia.getConsequenciaUri() + " <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#ocasionadaPor> ?uriCausa ." +
               "    ?uriCausa <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeCausa ." +
               "    ?uriCausa <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?descricaoCausa ." +
               "}";

    }

    public List<RelevanciaConsequenciaResponseDTO> calculateRelevanciaConsequencia(
            List<RelevanciaConsequenciaRequestDTO> consequencias) {

        var consequenciasRelevancia = new ArrayList<RelevanciaConsequenciaResponseDTO>();

        for (int i = 0; i < consequencias.size(); i++) {
            var consequencia = consequencias.get(i);

            var frequencia = consequencia.getFrequencia();
            var impacto = consequencia.getImpacto();

            var consequenciaRelevancia = new RelevanciaConsequenciaResponseDTO(consequencia.getConsequenciaUri(),
                                                                               frequencia,
                                                                               impacto,
                                                                               MatrizImpacto.MATRIZ[frequencia.getValue()][impacto.getValue()]);

            consequenciasRelevancia.add(consequenciaRelevancia);
        }

        return consequenciasRelevancia;
    }
}
