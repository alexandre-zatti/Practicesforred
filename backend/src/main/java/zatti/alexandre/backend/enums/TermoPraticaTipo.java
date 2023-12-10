package zatti.alexandre.backend.enums;

public enum TermoPraticaTipo {
    ATIVIDADE("http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#AtividadeProdutoTrabalho"),
    PRODUTO("http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#ProdutoTrabalhoPratica"),
    ALPHA("http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#Alpha"),
    ESPACO_ATIVIDADE("http://www.semanticweb.org/vivid/ontologies/2023/2/untitled-ontology-3#EspacoAtividade");

    private final String uri;

    TermoPraticaTipo(String uri) {
        this.uri = uri;
    }

    public String getUri() {
        return this.uri;
    }
}
