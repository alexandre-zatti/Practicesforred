package zatti.alexandre.backend.model;

public class Causa implements OntologyModel {

    private String nome;
    private String uri;
    private String descricao;

    public Causa(String nome, String uri, String descricao) {
        this.nome = nome;
        this.uri = uri;
        this.descricao = descricao;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getUri() {
        return uri;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
