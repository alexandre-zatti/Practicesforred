package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.enums.Frequencia;
import zatti.alexandre.backend.enums.Impacto;

public class RelevanciaConsequenciaRequestDTO {
    private String consequenciaUri;
    private String consequenciaNome;
    private String consequenciaDescricao;
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

    public String getConsequenciaNome() {
        return consequenciaNome;
    }

    public void setConsequenciaNome(String consequenciaNome) {
        this.consequenciaNome = consequenciaNome;
    }

    public String getConsequenciaDescricao() {
        return consequenciaDescricao;
    }

    public void setConsequenciaDescricao(String consequenciaDescricao) {
        this.consequenciaDescricao = consequenciaDescricao;
    }
}
