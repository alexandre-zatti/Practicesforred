package zatti.alexandre.backend.dto;

import java.util.List;

public final class TermoPraticaEspacoAtividadeDTO implements TermosPraticaResponseDTO {
    private final String termoPraticaTipo;
    private String termoPraticaUri;
    private String termoPraticaNome;
    private String termoPraticaDescricao;
    private Integer termoPraticaOrdem;
    private List<TermosPraticaResponseDTO> contempla;

    public TermoPraticaEspacoAtividadeDTO(String termoPraticaUri, String termoPraticaNome, String termoPraticaDescricao,
                                          Integer termoPraticaOrdem, String termoPraticaTipo,
                                          List<TermosPraticaResponseDTO> contempla) {
        this.termoPraticaUri = termoPraticaUri;
        this.termoPraticaNome = termoPraticaNome;
        this.termoPraticaDescricao = termoPraticaDescricao;
        this.termoPraticaOrdem = termoPraticaOrdem;
        this.termoPraticaTipo = termoPraticaTipo;
        this.contempla = contempla;
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

    public String getTermoPraticaDescricao() {
        return termoPraticaDescricao;
    }

    public void setTermoPraticaDescricao(String termoPraticaDescricao) {
        this.termoPraticaDescricao = termoPraticaDescricao;
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

    public List<TermosPraticaResponseDTO> getContempla() {
        return contempla;
    }

    public void setContempla(List<TermosPraticaResponseDTO> contempla) {
        this.contempla = contempla;
    }
}

