package zatti.alexandre.backend.model;

import java.util.ArrayList;
import java.util.List;

public class FaseEngenharia implements AbstractOntologyModel{
    private String nome;
    private List<Consequencia> consequencias;

    public FaseEngenharia(String nome) {
        this.nome = nome;
        this.consequencias = new ArrayList<>();
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<Consequencia> getConsequencias() {
        return consequencias;
    }

    public void addConsequencia(Consequencia consequencia) {
        consequencias.add(consequencia);
    }
}
