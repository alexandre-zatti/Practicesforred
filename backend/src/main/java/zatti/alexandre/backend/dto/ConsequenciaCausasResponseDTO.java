package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.model.Causa;

import java.util.ArrayList;
import java.util.List;

public class ConsequenciaCausasResponseDTO {
    private String consequenciaUri;
    private String consequenciaNome;
    private List<Causa> causas;

    public ConsequenciaCausasResponseDTO(String consequenciaUri, String consequenciaNome) {
        this.consequenciaUri = consequenciaUri;
        this.consequenciaNome = consequenciaNome;
        this.causas = new ArrayList<>();
    }

    public String getConsequenciaUri() {
        return consequenciaUri;
    }

    public void setConsequenciaUri(String consequenciaUri) {
        this.consequenciaUri = consequenciaUri;
    }

    public List<Causa> getCausas() {
        return causas;
    }

    public void setCausas(List<Causa> causas) {
        this.causas = causas;
    }

    public void addCausa(Causa causa) {
        this.causas.add(causa);
    }

    public String getConsequenciaNome() {
        return consequenciaNome;
    }

    public void setConsequenciaNome(String consequenciaNome) {
        this.consequenciaNome = consequenciaNome;
    }
}
