package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.model.Pratica;

import java.util.ArrayList;
import java.util.List;

public class PraticaGeralDTO {
    private Pratica praticaGeral;
    private List<Pratica> praticas;

    public PraticaGeralDTO(Pratica praticaGeral) {
        this.praticaGeral = praticaGeral;
        this.praticas = new ArrayList<>();
    }

    public PraticaGeralDTO(Pratica praticaGeral, List<Pratica> praticas) {
        this.praticaGeral = praticaGeral;
        this.praticas = praticas;
    }

    public Pratica getPraticaGeral() {
        return praticaGeral;
    }

    public void setPraticaGeral(Pratica praticaGeral) {
        this.praticaGeral = praticaGeral;
    }

    public List<Pratica> getPraticas() {
        return praticas;
    }

    public void setPraticas(List<Pratica> praticas) {
        this.praticas = praticas;
    }

    public void addPratica(Pratica pratica) {
        this.praticas.add(pratica);
    }
}
