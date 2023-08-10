package zatti.alexandre.backend.model;

public class Consequencia implements AbstractOntologyModel {

    private String nome;

    public Consequencia(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
