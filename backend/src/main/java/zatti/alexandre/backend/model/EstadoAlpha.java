package zatti.alexandre.backend.model;

import zatti.alexandre.backend.dto.TermosPraticaResponseDTO;

import java.util.List;

public class EstadoAlpha implements OntologyModel {
    private String uri;
    private String nome;
    private String descricao;
    private String ordem;
    private List<TermosPraticaResponseDTO> termosPratica;

    public EstadoAlpha(String uri, String nome, String descricao, String ordem,
                       List<TermosPraticaResponseDTO> termosPratica) {
        this.uri = uri;
        this.nome = nome;
        this.descricao = descricao;
        this.ordem = ordem;
        this.termosPratica = termosPratica;
    }

    public List<TermosPraticaResponseDTO> getTermosPratica() {
        return termosPratica;
    }

    public void setTermosPratica(List<TermosPraticaResponseDTO> termosPratica) {
        this.termosPratica = termosPratica;
    }

    public void addTermoPratica(TermosPraticaResponseDTO termoPratica) {
        this.termosPratica.add(termoPratica);
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getOrdem() {
        return ordem;
    }

    public void setOrdem(String ordem) {
        this.ordem = ordem;
    }

    @Override
    public String getUri() {
        return uri;
    }

    @Override
    public void setUri(String uri) {
        this.uri = uri;
    }

    @Override
    public String getNome() {
        return nome;
    }

    @Override
    public void setNome(String nome) {
        this.nome = nome;
    }
}
