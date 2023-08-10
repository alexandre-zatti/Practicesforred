package zatti.alexandre.backend.service;

import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zatti.alexandre.backend.model.AbstractOntologyModel;
import zatti.alexandre.backend.model.Consequencia;
import zatti.alexandre.backend.model.FaseEngenharia;

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

            model.read(new StringReader(rdfContent), null, "RDF/XML"); // Specify the correct RDF language
            dataset.getDefaultModel().add(model);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<FaseEngenharia> getFaseEngenhariaData() {
        String queryString =
        """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        
        SELECT ?nomeFase ?nomeConsequencia
        WHERE {
          ?fase rdf:type <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#FaseEngenhariaRequisitos> .
          ?fase <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeFase .
          ?fase <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#eEvidenciadaPor> ?evidenciadaPor .
          ?evidenciadaPor rdf:type <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#ConsequenciaReD> .
          ?evidenciadaPor <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeConsequencia .
        }
        """;
        Query query = QueryFactory.create(queryString);

        List<FaseEngenharia> resultList = new ArrayList<>();

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            ResultSet results = qe.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.next();

                int foundPreviousFaseEngenhariaIndex = findIndexOfItem(resultList, solution.get("nomeFase").toString());

                if (foundPreviousFaseEngenhariaIndex != -1) {
                    FaseEngenharia faseEngenharia = resultList.get(foundPreviousFaseEngenhariaIndex);
                    faseEngenharia.addConsequencia(new Consequencia(solution.get("nomeConsequencia").toString()));
                    resultList.set(foundPreviousFaseEngenhariaIndex, faseEngenharia);
                    continue;
                }

                FaseEngenharia faseEngenharia = new FaseEngenharia(solution.get("nomeFase").toString());
                faseEngenharia.addConsequencia(new Consequencia(solution.get("nomeConsequencia").toString()));
                resultList.add(faseEngenharia);
            }
        }

        return resultList;
    }

    private <T extends AbstractOntologyModel> int findIndexOfItem(List<T> list, String name) {
        for (int i = 0; i < list.size(); i++) {
            T item = list.get(i);
            if (item.getNome().equals(name)) {
                return i;
            }
        }
        return -1; // Return -1 if not found
    }

}
