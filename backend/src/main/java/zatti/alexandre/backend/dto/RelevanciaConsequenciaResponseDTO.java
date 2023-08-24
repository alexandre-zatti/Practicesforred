package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.enums.Frequencia;
import zatti.alexandre.backend.enums.GrauRelevancia;
import zatti.alexandre.backend.enums.Impacto;

public class RelevanciaConsequenciaResponseDTO {
    private String consequenciaUri;
    private Frequencia frequencia;
    private Impacto impacto;
    private GrauRelevancia grauRelevancia;

    public RelevanciaConsequenciaResponseDTO(String consequenciaUri, Frequencia frequencia, Impacto impacto,
                                             GrauRelevancia grauRelevancia) {
        this.consequenciaUri = consequenciaUri;
        this.frequencia = frequencia;
        this.impacto = impacto;
        this.grauRelevancia = grauRelevancia;
    }

    public String getConsequenciaUri() {
        return consequenciaUri;
    }

    public void setConsequenciaUri(String consequenciaUri) {
        this.consequenciaUri = consequenciaUri;
    }

    public GrauRelevancia getGrauRelevancia() {
        return grauRelevancia;
    }

    public void setGrauRelevancia(GrauRelevancia grauRelevancia) {
        this.grauRelevancia = grauRelevancia;
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
