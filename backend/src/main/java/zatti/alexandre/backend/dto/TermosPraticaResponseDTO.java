package zatti.alexandre.backend.dto;

public class TermosPraticaResponseDTO {
    private String termoPraticaUri;
    private String termoPraticaNome;
    private Integer termoPraticaOrdem;
    private String termoPraticaTipo;

    public String getTermoPraticaUri() {
        return termoPraticaUri;
    }

    public void setTermoPraticaUri(String termoPraticaUri) {
        this.termoPraticaUri = termoPraticaUri;
    }

    public String getTermoPraticaNome() {
        return termoPraticaNome;
    }

    public void setTermoPraticaNome(String termoPraticaNome) {
        this.termoPraticaNome = termoPraticaNome;
    }

    public Integer getTermoPraticaOrdem() {
        return termoPraticaOrdem;
    }

    public void setTermoPraticaOrdem(Integer termoPraticaOrdem) {
        this.termoPraticaOrdem = termoPraticaOrdem;
    }

    public String getTermoPraticaTipo() {
        return termoPraticaTipo;
    }

    public void setTermoPraticaTipo(String termoPraticaTipo) {
        this.termoPraticaTipo = termoPraticaTipo;
    }
}
