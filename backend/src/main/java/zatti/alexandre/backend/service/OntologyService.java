package zatti.alexandre.backend.service;

import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zatti.alexandre.backend.dto.*;
import zatti.alexandre.backend.enums.ClassificacaoPratica;
import zatti.alexandre.backend.enums.TermoPraticaTipo;
import zatti.alexandre.backend.model.*;
import zatti.alexandre.backend.utils.MatrizImpacto;

import java.io.StringReader;
import java.util.*;

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

    public List<FaseEngenhariaConsequenciasResponseDTO> getConsequenciasByFaseEngenharia() {
        var queryString = """
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

                int foundPreviousFaseEngenhariaIndex = isFaseEngenhariaAlreadyPresent(resultList,
                        solution.get("nomeFase").toString());

                if (foundPreviousFaseEngenhariaIndex != -1) {
                    var faseEngenharia = resultList.get(foundPreviousFaseEngenhariaIndex);
                    faseEngenharia.addFaseEngenhariaConsequencia(
                            new Consequencia(solution.get("nomeConsequencia").toString(),
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

    public List<TermosPraticaResponseDTO> getTermosPratica(String praticaUri) {
        var queryString = getTermosByPraticaQuery(praticaUri);
        var query = QueryFactory.create(queryString);
        var listaTermosPratica = new ArrayList<TermosPraticaResponseDTO>();

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            ResultSet results = qe.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.next();

                if (solution.get("termoTipo").toString().equals(TermoPraticaTipo.ATIVIDADE.getUri())) {
                    var solutionAtividade = getTermoAtividadePratica(solution.get("termoUri").toString());

                    var termoPratica = new TermoPraticaAtividadeDTO(
                            solution.get("termoUri").toString(),
                            solution.get("termoNome").toString(),
                            Integer.parseInt(solution.get("termoOrdemString").toString()),
                            solution.get("termoTipo").toString(),
                            solutionAtividade.get("termoAtividadeDescricao").toString(),
                            solutionAtividade.get("termoAtividadeApresentacao").toString(),
                            solutionAtividade.get("termoAtividadeInformacoes").toString(),
                            solutionAtividade.get("termoAtividadeAbordagens").toString(),
                            solutionAtividade.get("allTermoAtividadeProduz").toString()
                    );
                    listaTermosPratica.add(termoPratica);
                } else if (solution.get("termoTipo").toString().equals(TermoPraticaTipo.PRODUTO.getUri())) {
                    var termoPratica = new TermoPraticaProdutoDTO(
                            solution.get("termoDescricao").toString(),
                            solution.get("termoUri").toString(),
                            solution.get("termoNome").toString(),
                            Integer.parseInt(solution.get("termoOrdemString").toString()),
                            solution.get("termoTipo").toString(),
                            getPassosElementos(solution.get("termoUri").toString()),
                            getTermosPraticaGeneric(solution.get("termoUri").toString(), "eProduzidoPor"),
                            getTermosPraticaGeneric(solution.get("termoUri").toString(), "eOrganizadoPor")
                    );
                    listaTermosPratica.add(termoPratica);
                } else if (solution.get("termoTipo").toString().equals(TermoPraticaTipo.ALPHA.getUri())) {
                    var termoPratica = new TermoPraticaAlphaDTO(
                            solution.get("termoDescricao").toString(),
                            solution.get("termoUri").toString(),
                            solution.get("termoNome").toString(),
                            Integer.parseInt(solution.get("termoOrdemString").toString()),
                            solution.get("termoTipo").toString(),
                            getEstadosAlpha(solution.get("termoUri").toString()),
                            getTermosPraticaGeneric(solution.get("termoUri").toString(), "eProgredidoPor")
                    );
                    listaTermosPratica.add(termoPratica);
                }
            }
        }

        return listaTermosPratica;
    }

    private List<PassosElementos> getPassosElementos(String termoUri) {
        var queryString = getPassosElementosByTermoQuery(termoUri);
        var query = QueryFactory.create(queryString);
        var listaPassosElementos = new ArrayList<PassosElementos>();

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            ResultSet results = qe.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.next();

                var passoElemento = new PassosElementos(
                        solution.get("passoElementoUri").toString(),
                        solution.get("passoElementoNome").toString(),
                        solution.get("passoElementoDescricao").toString(),
                        solution.get("passoElementoOrdemString").toString(),
                        getTermosPraticaGeneric(solution.get("passoElementoUri").toString(), "atendidoPor"));

                listaPassosElementos.add(passoElemento);
            }
        }

        return listaPassosElementos;
    }

    private List<EstadoAlpha> getEstadosAlpha(String termoUri) {
        var queryString = getEstadosAlphaByTermoQuery(termoUri);
        var query = QueryFactory.create(queryString);
        var listaEstadosAlpha = new ArrayList<EstadoAlpha>();

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            ResultSet results = qe.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.next();

                var estadoAlpha = new EstadoAlpha(solution.get("estadoAlphaUri").toString(),
                        solution.get("estadoAlphaNome").toString(),
                        solution.get("estadoAlphaDescricao").toString(),
                        solution.get("estadoAlphaOrdemString").toString(),
                        getTermosPraticaGeneric(solution.get("estadoAlphaUri").toString(), "avancadoPor"));

                listaEstadosAlpha.add(estadoAlpha);
            }
        }

        return listaEstadosAlpha;
    }

    private List<TermosPraticaResponseDTO> getTermosPraticaGeneric(String uri, String conexao) {
        var queryString = getTermoPraticaGenericQuery(uri, conexao);
        var query = QueryFactory.create(queryString);
        var listaTermosPratica = new ArrayList<TermosPraticaResponseDTO>();

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            ResultSet results = qe.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.next();
                var termoPratica = new TermoPraticaDTO(
                        solution.get("termoUri").toString(),
                        solution.get("termoNome").toString(),
                        0,
                        solution.get("termoTipo").toString()
                );
                listaTermosPratica.add(termoPratica);
            }
        }
        return listaTermosPratica;
    }

    private String getPassosElementosByTermoQuery(String termoUri) {
        var queryTemplate = """
                            SELECT ?passoElementoUri ?passoElementoNome ?passoElementoDescricao (STR(?passoElementoOrdem) AS ?passoElementoOrdemString)
                            WHERE {
                                  <%s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#contem> ?passoElementoUri .
                                  ?passoElementoUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?passoElementoNome .
                                  ?passoElementoUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?passoElementoDescricao .
                                  ?passoElementoUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#sequencia> ?passoElementoOrdem .
                             }
                            """;

        return String.format(queryTemplate, termoUri);
    }

    private String getEstadosAlphaByTermoQuery(String termoUri) {
        var queryTemplate = """
                            SELECT ?estadoAlphaUri ?estadoAlphaNome ?estadoAlphaDescricao (STR(?estadoAlphaOrdem) AS ?estadoAlphaOrdemString)
                            WHERE {
                                 <%s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#possui> ?estadoAlphaUri .
                                 ?estadoAlphaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?estadoAlphaNome .
                                 ?estadoAlphaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?estadoAlphaDescricao .
                                 ?estadoAlphaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#sequencia> ?estadoAlphaOrdem .
                            }
                            """;

        return String.format(queryTemplate, termoUri);
    }

    private String getTermoPraticaGenericQuery(String uri, String conexao) {
        var queryTemplate = """
                            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                            PREFIX owl: <http://www.w3.org/2002/07/owl#>
                            SELECT *
                            WHERE {
                                 <%s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#%s> ?termoUri .
                                 ?termoUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?termoNome .
                                 ?termoUri rdf:type ?termoTipo .
                                 FILTER (?termoTipo != owl:NamedIndividual)
                            }
                            """;

        return String.format(queryTemplate, uri, conexao);
    }

    private QuerySolution getTermoAtividadePratica(String termoUri) {
        var queryString = getTermoAtividadeByTermoQuery(termoUri);
        var query = QueryFactory.create(queryString);

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            ResultSet results = qe.execSelect();
            if (results.hasNext()) {
                return results.next();
            }
        }

        return null;
    }

    private int isFaseEngenhariaAlreadyPresent(List<FaseEngenhariaConsequenciasResponseDTO> list, String name) {
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

        for (ConsequenciaCausasRequestDTO consequencia : consequencias) {
            var queryString = getCausaByConsequenciaQuery(consequencia);
            var query = QueryFactory.create(queryString);
            var causaConsequencia = new ConsequenciaCausasResponseDTO(consequencia.getConsequenciaUri(),
                    consequencia.getConsequenciaNome());

            try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
                ResultSet results = qe.execSelect();
                while (results.hasNext()) {
                    QuerySolution solution = results.next();
                    causaConsequencia.addCausa(
                            new Causa(solution.get("nomeCausa").toString(), solution.get("uriCausa").toString(),
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
                    var foundPreviousAreaGestaoIndex = checkIfAreaGestaoAlreadyPresent(listaCausasPraticas,
                            solution.get("uriAreaGestao").toString());

                    if (foundPreviousAreaGestaoIndex != -1) {
                        var causaPraticas = listaCausasPraticas.get(foundPreviousAreaGestaoIndex);
                        var foundPreviousPraticaGeralIndex = checkIfPraticaGeralAlreadyPresent(
                                causaPraticas.getPraticasGerais(), solution.get("uriPraticaGeral").toString());

                        if (foundPreviousPraticaGeralIndex != -1) {
                            var praticaGeral = causaPraticas.getPraticasGerais().get(foundPreviousPraticaGeralIndex);

                            var praticaAlreadyPresent = checkIfPraticaAlreadyPresent(praticaGeral.getPraticas(),
                                    solution.get("uriPratica").toString(), causa.getGrauRelevancia().ordinal());

                            var newPratica = new Pratica(solution.get("nomePratica").toString(),
                                    solution.get("uriPratica").toString(), solution.get("descricaoPratica").toString(),
                                    Optional.ofNullable(solution.get("fluxoAtividadesPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("apresentacaoPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("introducaoPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("quandoAplicarPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("referenciasPratica")).map(Object::toString)
                                            .orElse(""),
                                    ClassificacaoPratica.fromValue(solution.get("classificacaoPratica").toString()),
                                    causa.getGrauRelevancia());

                            if (praticaAlreadyPresent.getKey()) {
                                if (praticaAlreadyPresent.getValue() != -1) {
                                    praticaGeral.removePratica(praticaAlreadyPresent.getValue());
                                    praticaGeral.addPratica(newPratica);
                                }
                            } else {
                                praticaGeral.addPratica(newPratica);
                            }


                            causaPraticas.getPraticasGerais().set(foundPreviousPraticaGeralIndex, praticaGeral);
                            listaCausasPraticas.set(foundPreviousAreaGestaoIndex, causaPraticas);
                        } else {
                            var praticaGeral = new PraticaGeralDTO(
                                    new Pratica(solution.get("nomePraticaGeral").toString(),
                                            solution.get("uriPraticaGeral").toString(), ClassificacaoPratica.GERAL));

                            var praticaAlreadyPresent = checkIfPraticaAlreadyPresent(praticaGeral.getPraticas(),
                                    solution.get("uriPratica").toString(), causa.getGrauRelevancia().ordinal());

                            var newPratica = new Pratica(solution.get("nomePratica").toString(),
                                    solution.get("uriPratica").toString(), solution.get("descricaoPratica").toString(),
                                    Optional.ofNullable(solution.get("fluxoAtividadesPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("apresentacaoPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("introducaoPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("quandoAplicarPratica")).map(Object::toString)
                                            .orElse(""),
                                    Optional.ofNullable(solution.get("referenciasPratica")).map(Object::toString)
                                            .orElse(""),
                                    ClassificacaoPratica.fromValue(solution.get("classificacaoPratica").toString()),
                                    causa.getGrauRelevancia());

                            if (praticaAlreadyPresent.getKey()) {
                                if (praticaAlreadyPresent.getValue() != -1) {
                                    praticaGeral.removePratica(praticaAlreadyPresent.getValue());
                                    praticaGeral.addPratica(newPratica);
                                }
                            } else {
                                praticaGeral.addPratica(newPratica);
                            }

                            causaPraticas.addPraticaGeral(praticaGeral);
                            listaCausasPraticas.set(foundPreviousAreaGestaoIndex, causaPraticas);
                        }
                    } else {
                        var causaPraticas = new CausaPraticasResponseDTO(
                                new AreaGestao(solution.get("uriAreaGestao").toString(),
                                        solution.get("nomeAreaGestao").toString(),
                                        solution.get("descricaoAreaGestao").toString()));
                        var praticaGeral = new PraticaGeralDTO(new Pratica(solution.get("nomePraticaGeral").toString(),
                                solution.get("uriPraticaGeral").toString(), ClassificacaoPratica.GERAL));

                        var praticaAlreadyPresent = checkIfPraticaAlreadyPresent(praticaGeral.getPraticas(),
                                solution.get("uriPratica").toString(), causa.getGrauRelevancia().ordinal());

                        var newPratica = new Pratica(solution.get("nomePratica").toString(),
                                solution.get("uriPratica").toString(), solution.get("descricaoPratica").toString(),
                                Optional.ofNullable(solution.get("fluxoAtividadesPratica")).map(Object::toString)
                                        .orElse(""),
                                Optional.ofNullable(solution.get("apresentacaoPratica")).map(Object::toString)
                                        .orElse(""),
                                Optional.ofNullable(solution.get("introducaoPratica")).map(Object::toString).orElse(""),
                                Optional.ofNullable(solution.get("quandoAplicarPratica")).map(Object::toString)
                                        .orElse(""),
                                Optional.ofNullable(solution.get("referenciasPratica")).map(Object::toString)
                                        .orElse(""),
                                ClassificacaoPratica.fromValue(solution.get("classificacaoPratica").toString()),
                                causa.getGrauRelevancia());

                        if (praticaAlreadyPresent.getKey()) {
                            if (praticaAlreadyPresent.getValue() != -1) {
                                praticaGeral.removePratica(praticaAlreadyPresent.getValue());
                                praticaGeral.addPratica(newPratica);
                            }
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

    public List<ConsequenciaCausasResponseDTO> getCausasConsequenciasByPratica(String praticaUri) {
        var queryString = getCausasConsequenciasByPraticaQuery(praticaUri);
        var query = QueryFactory.create(queryString);
        var causasConsequenciasPratica = new ArrayList<ConsequenciaCausasResponseDTO>();

        try (QueryExecution qe = QueryExecutionFactory.create(query, dataset.getDefaultModel())) {
            ResultSet results = qe.execSelect();
            while (results.hasNext()) {
                QuerySolution solution = results.next();

                var consequenciaAlreadyInList = causasConsequenciasPratica.stream().anyMatch(
                        consequencia -> consequencia.getConsequenciaUri()
                                .equals(solution.get("consequenciaUri").toString()));

                if (!consequenciaAlreadyInList) {
                    causasConsequenciasPratica.add(
                            new ConsequenciaCausasResponseDTO(solution.get("consequenciaUri").toString(),
                                    solution.get("consequenciaNome").toString()));
                }

                var causaAlreadyInList = causasConsequenciasPratica.stream().anyMatch(
                        consequencia -> consequencia.getCausas().stream()
                                .anyMatch(causa -> causa.getUri().equals(solution.get("causaUri").toString())));

                if (!causaAlreadyInList) {
                    causasConsequenciasPratica.stream().filter(consequencia -> consequencia.getConsequenciaUri()
                            .equals(solution.get("consequenciaUri").toString())).findFirst().ifPresent(
                            consequencia -> consequencia.addCausa(
                                    new Causa(solution.get("causaUri").toString(), solution.get("causaNome").toString(),
                                            solution.get("causaDescricao").toString())));
                }
            }
        }

        return causasConsequenciasPratica;
    }

    private Map.Entry<Boolean, Integer> checkIfPraticaAlreadyPresent(List<Pratica> listaPraticas, String uriPratica,
                                                                     Integer grauRelevancia) {
        for (int i = 0; i < listaPraticas.size(); i++) {
            var item = listaPraticas.get(i);
            if (item.getUri().equals(uriPratica)) {
                if (item.getGrauRelevancia().ordinal() >= grauRelevancia) {
                    return new AbstractMap.SimpleEntry<>(true, i);
                } else {
                    return new AbstractMap.SimpleEntry<>(true, -1);
                }
            }
        }
        return new AbstractMap.SimpleEntry<>(false, -1);
    }

    private int checkIfPraticaGeralAlreadyPresent(List<PraticaGeralDTO> listaPraticasGerais, String uriPraticaGeral) {
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

    private String getCausasConsequenciasByPraticaQuery(String praticaUri) {
        var queryTemplate = """
                            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                            SELECT *
                            WHERE {
                                ?consequenciaUri rdf:type <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#ConsequenciaReD>  .
                                ?consequenciaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?consequenciaNome .
                                ?consequenciaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?consequenciaDescricao .
                                            
                                ?consequenciaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#ocasionadaPor> ?causaUri .
                                ?causaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?causaNome .
                                ?causaUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?causaDescricao .
                                            
                                ?pratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#podeMitigar> ?causaUri .
                                FILTER (?pratica = %s)
                             }""";

        return String.format(queryTemplate, praticaUri);
    }

    private String getTermosByPraticaQuery(String praticaUri) {
        var queryTemplate = """ 
                            PREFIX owl: <http://www.w3.org/2002/07/owl#>
                            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
                            SELECT ?termoUri ?termoNome ?termoDescricao (STR(?termoOrdem) AS ?termoOrdemString) ?termoTipo
                            WHERE {
                                %s <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descritoEmTermosDe> ?termoUri .
                                ?termoUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#sequencia> ?termoOrdem .
                                ?termoUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?termoNome .
                                ?termoUri <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?termoDescricao .
                                ?termoUri rdf:type ?termoTipo .
                                FILTER (?termoTipo != owl:NamedIndividual)
                            }""";

        return String.format(queryTemplate, praticaUri);
    }

    private String getTermoAtividadeByTermoQuery(String termoUri) {
        var queryTemplate = """ 
                            PREFIX owl: <http://www.w3.org/2002/07/owl#>
                            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

                            SELECT ?termoAtividadeDescricao ?termoAtividadeApresentacao ?termoAtividadeInformacoes ?termoAtividadeAbordagens (GROUP_CONCAT(?termoAtividadeProduz; SEPARATOR="|") AS ?allTermoAtividadeProduz)
                            WHERE {
                                <%1$s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> ?termoAtividadeDescricao .
                                <%1$s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#apresAtividade> ?termoAtividadeApresentacao .
                                <%1$s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#infAdicionais> ?termoAtividadeInformacoes .
                                <%1$s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#abordagens> ?termoAtividadeAbordagens.
                                <%1$s> <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#produz> ?termoAtividadeProduz .
                            }
                            GROUP BY ?termoAtividadeDescricao ?termoAtividadeApresentacao ?termoAtividadeInformacoes ?termoAtividadeAbordagens""";

        return String.format(queryTemplate, termoUri);
    }


    private String getPraticasByCausaQuery(CausaPraticasRequestDTO causa) {


        return "SELECT *" +
                "WHERE {" +
                "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#podeMitigar>" +
                " " + causa.getCausaPraticaUri() + " ." +
                "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome>  " +
                "?nomePratica ." +
                "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao>  " +
                "?descricaoPratica ." +
                "    OPTIONAL { ?uriPratica <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#fluxoAtividades>  ?fluxoAtividadesPratica . }" +
                "    OPTIONAL { ?uriPratica <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#apresentacao>  ?apresentacaoPratica . }" +
                "    OPTIONAL { ?uriPratica <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#quandoAplicar>  ?quandoAplicarPratica . }" +
                "    OPTIONAL { ?uriPratica <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#introducao>  ?introducaoPratica . }" +
                "    OPTIONAL { ?uriPratica <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#referenciaRE>  ?referenciasPratica . }" +
                "    ?uriPratica <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#classificacaoPratica>  ?classificacaoPratica ." +
                "    ?uriPratica <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#implementa> " +
                "?uriPraticaGeral ." +
                "    ?uriPraticaGeral <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome>  " +
                "?nomePraticaGeral ." +
//               "    ?uriPraticaGeral <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao>
//               ?descricaoPraticaGeral ." +
                "    ?uriPraticaGeral <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#classificacaoPratica>  ?classificacaoPraticaGeral ." +
                "    ?uriPraticaGeral <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#eParteDe> ?uriAreaGestao ." +
                "    ?uriAreaGestao <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome>  " +
                "?nomeAreaGestao ." +
                "    ?uriAreaGestao <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#descricao>  ?descricaoAreaGestao ." +
                " }";

    }

    private String getCausaByConsequenciaQuery(ConsequenciaCausasRequestDTO consequencia) {

        return "SELECT ?nomeConsequencia ?uriCausa ?nomeCausa ?descricaoCausa " +
                "WHERE {" +
                "    " + consequencia.getConsequenciaUri() + " <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#nome> ?nomeConsequencia ." +
                "    " + consequencia.getConsequenciaUri() + " <http://www.semanticweb" +
                ".org/vivid/ontologies/2023/2/untitled-ontology-3#ocasionadaPor> ?uriCausa ." +
                "    ?uriCausa <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#nome> " +
                "?nomeCausa ." +
                "    ?uriCausa <http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#descricao> " +
                "?descricaoCausa ." +
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
                    consequencia.getConsequenciaNome(), consequencia.getConsequenciaDescricao(), frequencia, impacto,
                    MatrizImpacto.MATRIZ[frequencia.getValue()][impacto.getValue()]);

            consequenciasRelevancia.add(consequenciaRelevancia);
        }

        return consequenciasRelevancia;
    }
}
