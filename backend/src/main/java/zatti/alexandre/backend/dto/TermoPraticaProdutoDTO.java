package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.model.PassosElementos;

import java.util.List;

public final class TermoPraticaProdutoDTO implements TermosPraticaResponseDTO {
    private String termoPraticaDescricao;
    private String termoPraticaUri;
    private String termoPraticaNome;
    private Integer termoPraticaOrdem;
    private String termoPraticaTipo;
    private String termoPraticaAcessa;
    private List<PassosElementos> passosElementos;
    private List<TermosPraticaResponseDTO> produzidoPor;
    private List<TermosPraticaResponseDTO> organizadoPor;

    public TermoPraticaProdutoDTO(String termoPraticaDescricao, String termoPraticaUri, String termoPraticaNome,
                                  Integer termoPraticaOrdem, String termoPraticaTipo, String termoPraticaAcessa,
                                  List<PassosElementos> passosElementos,
                                  List<TermosPraticaResponseDTO> produzidoPor,
                                  List<TermosPraticaResponseDTO> organizadoPor) {
        this.termoPraticaDescricao = termoPraticaDescricao;
        this.termoPraticaUri = termoPraticaUri;
        this.termoPraticaNome = termoPraticaNome;
        this.termoPraticaOrdem = termoPraticaOrdem;
        this.termoPraticaTipo = termoPraticaTipo;
        this.termoPraticaAcessa = termoPraticaAcessa;
        this.passosElementos = passosElementos;
        this.produzidoPor = produzidoPor;
        this.organizadoPor = organizadoPor;
    }

    public List<PassosElementos> getPassosElementos() {
        return passosElementos;
    }

    public void setPassosElementos(List<PassosElementos> passosElementos) {
        this.passosElementos = passosElementos;
    }

    public List<TermosPraticaResponseDTO> getProduzidoPor() {
        return produzidoPor;
    }

    public void setProduzidoPor(List<TermosPraticaResponseDTO> produzidoPor) {
        this.produzidoPor = produzidoPor;
    }

    public List<TermosPraticaResponseDTO> getOrganizadoPor() {
        return organizadoPor;
    }

    public void setOrganizadoPor(List<TermosPraticaResponseDTO> organizadoPor) {
        this.organizadoPor = organizadoPor;
    }

    public String getTermoPraticaDescricao() {
        return termoPraticaDescricao;
    }

    public void setTermoPraticaDescricao(String termoPraticaDescricao) {
        this.termoPraticaDescricao = termoPraticaDescricao;
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
