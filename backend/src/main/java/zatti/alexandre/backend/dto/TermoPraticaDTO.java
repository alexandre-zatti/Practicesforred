package zatti.alexandre.backend.dto;

public final class TermoPraticaDTO implements TermosPraticaResponseDTO {
    private String termoPraticaUri;
    private String termoPraticaNome;
    private Integer termoPraticaOrdem;
    private String termoPraticaTipo;
    private String termoPraticaAcessa;

    public TermoPraticaDTO(String termoPraticaUri, String termoPraticaNome, Integer termoPraticaOrdem,
                           String termoPraticaTipo, String termoPraticaAcessa) {
        this.termoPraticaUri = termoPraticaUri;
        this.termoPraticaNome = termoPraticaNome;
        this.termoPraticaOrdem = termoPraticaOrdem;
        this.termoPraticaTipo = termoPraticaTipo;
        this.termoPraticaAcessa = termoPraticaAcessa;
    }

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

    public String getTermoPraticaAcessa() {
        return termoPraticaAcessa;
    }

    public void setTermoPraticaAcessa(String termoPraticaAcessa) {
        this.termoPraticaAcessa = termoPraticaAcessa;
    }
}
