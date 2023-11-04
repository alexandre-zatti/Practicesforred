package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.model.EstadoAlpha;

import java.util.List;

public final class TermoPraticaAlphaDTO implements TermosPraticaResponseDTO {
    private final String termoPraticaDescricao;
    private String termoPraticaUri;
    private String termoPraticaNome;
    private Integer termoPraticaOrdem;
    private String termoPraticaTipo;
    private List<EstadoAlpha> estadosAlpha;
    private List<TermosPraticaResponseDTO> termosPratica;

    public TermoPraticaAlphaDTO(String termoPraticaDescricao, String termoPraticaUri, String termoPraticaNome,
                                Integer termoPraticaOrdem, String termoPraticaTipo, List<EstadoAlpha> estadosAlpha,
                                List<TermosPraticaResponseDTO> termosPratica) {
        this.termoPraticaDescricao = termoPraticaDescricao;
        this.termoPraticaUri = termoPraticaUri;
        this.termoPraticaNome = termoPraticaNome;
        this.termoPraticaOrdem = termoPraticaOrdem;
        this.termoPraticaTipo = termoPraticaTipo;
        this.estadosAlpha = estadosAlpha;
        this.termosPratica = termosPratica;
    }

    public List<TermosPraticaResponseDTO> getTermosPratica() {
        return termosPratica;
    }

    public void setTermosPratica(List<TermosPraticaResponseDTO> termosPratica) {
        this.termosPratica = termosPratica;
    }

    public List<EstadoAlpha> getEstadosAlpha() {
        return estadosAlpha;
    }

    public void setEstadosAlpha(List<EstadoAlpha> estadosAlpha) {
        this.estadosAlpha = estadosAlpha;
    }

    public String getTermoPraticaDescricao() {
        return termoPraticaDescricao;
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
}
