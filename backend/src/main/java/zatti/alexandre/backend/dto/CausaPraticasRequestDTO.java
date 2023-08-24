package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.enums.GrauRelevancia;

public class CausaPraticasRequestDTO {
    private String causaPraticaUri;
    private String causaPraticaNome;
    private GrauRelevancia grauRelevancia;

    public String getCausaPraticaUri() {
        return causaPraticaUri;
    }

    public void setCausaPraticaUri(String causaPraticaUri) {
        this.causaPraticaUri = causaPraticaUri;
    }

    public String getCausaPraticaNome() {
        return causaPraticaNome;
    }

    public void setCausaPraticaNome(String causaPraticaNome) {
        this.causaPraticaNome = causaPraticaNome;
    }

    public GrauRelevancia getGrauRelevancia() {
        return grauRelevancia;
    }

    public void setGrauRelevancia(GrauRelevancia grauRelevancia) {
        this.grauRelevancia = grauRelevancia;
    }
}
