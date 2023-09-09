package zatti.alexandre.backend.service;

import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zatti.alexandre.backend.dto.*;
import zatti.alexandre.backend.enums.ClassificacaoPratica;
import zatti.alexandre.backend.model.AreaGestao;
import zatti.alexandre.backend.model.Causa;
import zatti.alexandre.backend.model.Consequencia;
import zatti.alexandre.backend.model.Pratica;
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
                          ?fase <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#faseER> ?faseER .
                          ?fase <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#eEvidenciadaPor> ?evidenciadaPor .
                          ?evidenciadaPor rdf:type <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#ConsequenciaReD> .
                          ?evidenciadaPor <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeConsequencia .
                          ?evidenciadaPor <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?descricaoConsequencia .
                        }
                        ORDER BY ?faseER
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

    public List<CausaPraticasResponseDTO> getPraticasByCausa(List<CausaPraticasRequestDTO> causas) {
        var listaCausasPraticas = new ArrayList<CausaPraticasResponseDTO>();

        for (int i = 0; i < causas.size(); i++) {
            var causa = causas.get(i);
            var queryString = getPraticasByCausaQuery(causa);
            var query = QueryFactory.create(queryString);

            try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
                ResultSet results = qe.execSelect();
                while (results.hasNext()) {
                    QuerySolution solution = results.next();
                    var foundPreviousAreaGestaoIndex =
                            checkIfAreaGestaoAlreadyPresent(listaCausasPraticas,
                                                            solution.get("uriAreaGestao").toString());

                    if (foundPreviousAreaGestaoIndex != -1) {
                        var causaPraticas = listaCausasPraticas.get(foundPreviousAreaGestaoIndex);
                        var foundPreviousPraticaGeralIndex =
                                checkIfPraticaGeralAlreadyPresent(causaPraticas.getPraticasGerais(),
                                                                  solution.get("uriPraticaGeral").toString());

                        if (foundPreviousPraticaGeralIndex != -1) {
                            var praticaGeral = causaPraticas.getPraticasGerais().get(foundPreviousPraticaGeralIndex);

                            var praticaAlreadyPresent = checkIfPraticaAlreadyPresent(praticaGeral.getPraticas(),
                                                                                     solution.get(
                                                                                             "uriPratica").toString(),
                                                                                     causa.getGrauRelevancia().ordinal());

                            var newPratica = new Pratica(solution.get("nomePratica").toString(),
                                                         solution.get("uriPratica").toString(),
                                                         solution.get("descricaoPratica").toString(),
                                                         ClassificacaoPratica.fromValue(solution.get(
                                                                 "classificacaoPratica").toString()),
                                                         causa.getGrauRelevancia());

                            if (praticaAlreadyPresent != -1) {
                                praticaGeral.removePratica(praticaAlreadyPresent);
                                praticaGeral.addPratica(newPratica);
                            } else {
                                praticaGeral.addPratica(newPratica);
                            }


                            causaPraticas.getPraticasGerais().set(foundPreviousPraticaGeralIndex, praticaGeral);
                            listaCausasPraticas.set(foundPreviousAreaGestaoIndex, causaPraticas);
                        } else {
                            var praticaGeral =
                                    new PraticaGeralDTO(new Pratica(solution.get("nomePraticaGeral").toString(),
                                                                    solution.get("uriPraticaGeral").toString(),
                                                                    ClassificacaoPratica.GERAL));

                            var praticaAlreadyPresent = checkIfPraticaAlreadyPresent(praticaGeral.getPraticas(),
                                                                                     solution.get(
                                                                                             "uriPratica").toString(),
                                                                                     causa.getGrauRelevancia().ordinal());

                            var newPratica = new Pratica(solution.get("nomePratica").toString(),
                                                         solution.get("uriPratica").toString(),
                                                         solution.get("descricaoPratica").toString(),
                                                         ClassificacaoPratica.fromValue(solution.get(
                                                                 "classificacaoPratica").toString()),
                                                         causa.getGrauRelevancia());

                            if (praticaAlreadyPresent != -1) {
                                praticaGeral.removePratica(praticaAlreadyPresent);
                                praticaGeral.addPratica(newPratica);
                            } else {
                                praticaGeral.addPratica(newPratica);
                            }

                            causaPraticas.addPraticaGeral(praticaGeral);
                            listaCausasPraticas.set(foundPreviousAreaGestaoIndex, causaPraticas);
                        }
                    } else {
                        var causaPraticas =
                                new CausaPraticasResponseDTO(new AreaGestao(solution.get("uriAreaGestao").toString(),
                                                                            solution.get("nomeAreaGestao").toString(),
                                                                            solution.get(
                                                                                    "descricaoAreaGestao").toString()));
                        var praticaGeral =
                                new PraticaGeralDTO(new Pratica(solution.get("nomePraticaGeral").toString(),
                                                                solution.get("uriPraticaGeral").toString(),
                                                                ClassificacaoPratica.GERAL));

                        var praticaAlreadyPresent = checkIfPraticaAlreadyPresent(praticaGeral.getPraticas(),
                                                                                 solution.get("uriPratica").toString(),
                                                                                 causa.getGrauRelevancia().ordinal());

                        var newPratica = new Pratica(solution.get("nomePratica").toString(),
                                                     solution.get("uriPratica").toString(),
                                                     solution.get("descricaoPratica").toString(),
                                                     ClassificacaoPratica.fromValue(solution.get(
                                                             "classificacaoPratica").toString()),
                                                     causa.getGrauRelevancia());

                        if (praticaAlreadyPresent != -1) {
                            praticaGeral.removePratica(praticaAlreadyPresent);
                            praticaGeral.addPratica(newPratica);
                        } else {
                            praticaGeral.addPratica(newPratica);
                        }

                        causaPraticas.addPraticaGeral(praticaGeral);
                        listaCausasPraticas.add(causaPraticas);
                    }
                }
            }
        }

        return listaCausasPraticas;
    }

    private int checkIfPraticaAlreadyPresent(List<Pratica> listaPraticas,
                                             String uriPratica, Integer grauRelevancia) {
        for (int i = 0; i < listaPraticas.size(); i++) {
            var item = listaPraticas.get(i);
            if (item.getUri().equals(uriPratica)) {
                if (item.getGrauRelevancia().ordinal() <= grauRelevancia) {
                    return i;
                }
            }
        }
        return -1;
    }

    private int checkIfPraticaGeralAlreadyPresent(List<PraticaGeralDTO> listaPraticasGerais,
                                                  String uriPraticaGeral) {
        for (int i = 0; i < listaPraticasGerais.size(); i++) {
            var item = listaPraticasGerais.get(i);
            if (item.getPraticaGeral().getUri().equals(uriPraticaGeral)) {
                return i;
            }
        }
        return -1;
    }

    private int checkIfAreaGestaoAlreadyPresent(List<CausaPraticasResponseDTO> listaCausasPraticas,
                                                String uriAreaGestao) {
        for (int i = 0; i < listaCausasPraticas.size(); i++) {
            var item = listaCausasPraticas.get(i);
            if (item.getAreaGestao().getUri().equals(uriAreaGestao)) {
                return i;
            }
        }
        return -1;
    }

    private String getPraticasByCausaQuery(CausaPraticasRequestDTO causa) {

        return "SELECT *" +
               "WHERE {" +
               "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#podeMitigar> " + causa.getCausaPraticaUri() + " ." +
               "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome>  ?nomePratica ." +
               "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao>  ?descricaoPratica ." +
               "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#classificacaoPratica>  ?classificacaoPratica ." +
               "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#implementa> ?uriPraticaGeral ." +
               "    ?uriPraticaGeral <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome>  ?nomePraticaGeral ." +
//               "    ?uriPraticaGeral <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao>  ?descricaoPraticaGeral ." +
               "    ?uriPraticaGeral <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#classificacaoPratica>  ?classificacaoPraticaGeral ." +
               "    ?uriPraticaGeral <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#eParteDe> ?uriAreaGestao ." +
               "    ?uriAreaGestao <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome>  ?nomeAreaGestao ." +
               "    ?uriAreaGestao <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao>  ?descricaoAreaGestao ." +
               " }";

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
                                                                               consequencia.getConsequenciaNome(),
                                                                               consequencia.getConsequenciaDescricao(),
                                                                               frequencia,
                                                                               impacto,
                                                                               MatrizImpacto.MATRIZ[frequencia.getValue()][impacto.getValue()]);

            consequenciasRelevancia.add(consequenciaRelevancia);
        }

        return consequenciasRelevancia;
    }
}
