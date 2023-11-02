package zatti.alexandre.backend.dto;

public final class TermoPraticaAtividadeDTO implements TermosPraticaResponseDTO {
    private final String termoPraticaProduz;
    private String termoPraticaUri;
    private String termoPraticaNome;
    private Integer termoPraticaOrdem;
    private String termoPraticaTipo;
    private String termoPraticaDescricao;
    private String termoPraticaApresentacao;
    private String termoPraticaInformacoesAdicionais;
    private String termoPraticaAbordagens;

    public TermoPraticaAtividadeDTO(String termoPraticaUri, String termoPraticaNome, Integer termoPraticaOrdem,
                                    String termoPraticaTipo, String termoPraticaDescricao,
                                    String termoPraticaApresentacao,
                                    String termoPraticaInformacoesAdicionais, String termoPraticaAbordagens,
                                    String termoPraticaProduz) {
        this.termoPraticaUri = termoPraticaUri;
        this.termoPraticaNome = termoPraticaNome;
        this.termoPraticaOrdem = termoPraticaOrdem;
        this.termoPraticaTipo = termoPraticaTipo;
        this.termoPraticaDescricao = termoPraticaDescricao;
        this.termoPraticaApresentacao = termoPraticaApresentacao;
        this.termoPraticaInformacoesAdicionais = termoPraticaInformacoesAdicionais;
        this.termoPraticaAbordagens = termoPraticaAbordagens;
        this.termoPraticaProduz = termoPraticaProduz;
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

    public String getTermoPraticaDescricao() {
        return termoPraticaDescricao;
    }

    public void setTermoPraticaDescricao(String termoPraticaDescricao) {
        this.termoPraticaDescricao = termoPraticaDescricao;
    }

    public String getTermoPraticaApresentacao() {
        return termoPraticaApresentacao;
    }

    public void setTermoPraticaApresentacao(String termoPraticaApresentacao) {
        this.termoPraticaApresentacao = termoPraticaApresentacao;
    }

    public String getTermoPraticaInformacoesAdicionais() {
        return termoPraticaInformacoesAdicionais;
    }

    public void setTermoPraticaInformacoesAdicionais(String termoPraticaInformacoesAdicionais) {
        this.termoPraticaInformacoesAdicionais = termoPraticaInformacoesAdicionais;
    }

    public String getTermoPraticaAbordagens() {
        return termoPraticaAbordagens;
    }

    public void setTermoPraticaAbordagens(String termoPraticaAbordagens) {
        this.termoPraticaAbordagens = termoPraticaAbordagens;
    }

    public String getTermoPraticaProduz() {
        return termoPraticaProduz;
    }
}
