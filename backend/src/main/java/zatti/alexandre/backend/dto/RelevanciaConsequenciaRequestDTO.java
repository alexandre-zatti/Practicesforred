package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.enums.Frequencia;
import zatti.alexandre.backend.enums.Impacto;

public class RelevanciaConsequenciaRequestDTO {
    private String consequenciaUri;
    private Frequencia frequencia;
    private Impacto impacto;

    public String getConsequenciaUri() {
        return consequenciaUri;
    }

    public void setConsequenciaUri(String consequenciaUri) {
        this.consequenciaUri = consequenciaUri;
    }

    public Frequencia getFrequencia() {
        return frequencia;
    }

    public void setFrequencia(Frequencia frequencia) {
        this.frequencia = frequencia;
    }

    public Impacto getImpacto() {
        return impacto;
    }

    public void setImpacto(Impacto impacto) {
        this.impacto = impacto;
    }
}
