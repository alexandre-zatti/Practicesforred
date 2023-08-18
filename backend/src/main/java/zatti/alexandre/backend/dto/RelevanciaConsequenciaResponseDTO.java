package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.enums.GrauRelevancia;

public class RelevanciaConsequenciaResponseDTO {
    private String consequenciaUri;
    private GrauRelevancia grauRelevancia;

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
}
