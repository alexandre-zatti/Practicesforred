package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.model.Consequencia;

import java.util.ArrayList;
import java.util.List;

public class FaseEngenhariaConsequenciasResponseDTO {
    private String faseEngenhariaUri;
    private String faseEngenhariaNome;
    private List<Consequencia> faseEngenhariaConsequencias;

    public FaseEngenhariaConsequenciasResponseDTO(String faseEngenhariaNome, String faseEngenhariaUri) {
        this.faseEngenhariaUri = faseEngenhariaUri;
        this.faseEngenhariaNome = faseEngenhariaNome;
        this.faseEngenhariaConsequencias = new ArrayList<>();
    }

    public String getFaseEngenhariaUri() {
        return faseEngenhariaUri;
    }

    public void setFaseEngenhariaUri(String faseEngenhariaUri) {
        this.faseEngenhariaUri = faseEngenhariaUri;
    }

    public String getFaseEngenhariaNome() {
        return faseEngenhariaNome;
    }

    public void setFaseEngenhariaNome(String faseEngenhariaNome) {
        this.faseEngenhariaNome = faseEngenhariaNome;
    }

    public List<Consequencia> getFaseEngenhariaConsequencias() {
        return faseEngenhariaConsequencias;
    }

    public void setFaseEngenhariaConsequencias(List<Consequencia> faseEngenhariaConsequencias) {
        this.faseEngenhariaConsequencias = faseEngenhariaConsequencias;
    }

    public void addFaseEngenhariaConsequencia(Consequencia consequencia) {
        this.faseEngenhariaConsequencias.add(consequencia);
    }
}
