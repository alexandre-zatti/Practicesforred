package zatti.alexandre.backend.model;

public class FaseEngenharia implements OntologyModel {

    private String uri;
    private String nome;
    private String sigla;

    public FaseEngenharia(String uri, String nome, String sigla) {
        this.uri = uri;
        this.nome = nome;
        this.sigla = sigla;
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

    public String getSigla() {
        return sigla;
    }

    public void setSigla(String sigla) {
        this.sigla = sigla;
    }
}
