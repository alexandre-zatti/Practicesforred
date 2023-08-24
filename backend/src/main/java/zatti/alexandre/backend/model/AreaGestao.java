package zatti.alexandre.backend.model;

public class AreaGestao implements OntologyModel {

    private String uri;
    private String nome;
    private String descricao;

    public AreaGestao(String uri, String nome, String descricao) {
        this.uri = uri;
        this.nome = nome;
        this.descricao = descricao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
