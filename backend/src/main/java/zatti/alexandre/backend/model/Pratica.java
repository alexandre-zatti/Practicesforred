package zatti.alexandre.backend.model;

import zatti.alexandre.backend.enums.ClassificacaoPratica;
import zatti.alexandre.backend.enums.GrauRelevancia;

public class Pratica implements OntologyModel {

    private String nome;

    private String uri;

    private String descricao;

    private String fluxoAtividades;

    private String apresentacao;

    private String introducao;

    private String quandoAplicar;

    private String referencias;

    private ClassificacaoPratica classificacaoPratica;

    private GrauRelevancia grauRelevancia = null;

    public Pratica(String nome, String uri, ClassificacaoPratica classificacaoPratica) {
        this.nome = nome;
        this.uri = uri;
        this.descricao = "";
        this.classificacaoPratica = classificacaoPratica;
    }

    public Pratica(String nome, String uri, String descricao, ClassificacaoPratica classificacaoPratica) {
        this.nome = nome;
        this.uri = uri;
        this.descricao = descricao;
        this.classificacaoPratica = classificacaoPratica;
    }

    public Pratica(String nome, String uri, String descricao, ClassificacaoPratica classificacaoPratica,
                   GrauRelevancia grauRelevancia) {
        this.nome = nome;
        this.uri = uri;
        this.descricao = descricao;
        this.classificacaoPratica = classificacaoPratica;
        this.grauRelevancia = grauRelevancia;
    }

    public Pratica(String nome, String uri, String descricao, String fluxoAtividades, String apresentacao,
                   String introducao, String quandoAplicar, String referencias,
                   ClassificacaoPratica classificacaoPratica, GrauRelevancia grauRelevancia) {
        this.nome = nome;
        this.uri = uri;
        this.descricao = descricao;
        this.fluxoAtividades = fluxoAtividades;
        this.apresentacao = apresentacao;
        this.introducao = introducao;
        this.quandoAplicar = quandoAplicar;
        this.classificacaoPratica = classificacaoPratica;
        this.referencias = referencias;
        this.grauRelevancia = grauRelevancia;
    }

    public GrauRelevancia getGrauRelevancia() {
        return grauRelevancia;
    }

    public void setGrauRelevancia(GrauRelevancia grauRelevancia) {
        this.grauRelevancia = grauRelevancia;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public ClassificacaoPratica getClassificacaoPratica() {
        return classificacaoPratica;
    }

    public void setClassificacaoPratica(ClassificacaoPratica classificacaoPratica) {
        this.classificacaoPratica = classificacaoPratica;
    }

    public String getFluxoAtividades() {
        return fluxoAtividades;
    }

    public void setFluxoAtividades(String fluxoAtividades) {
        this.fluxoAtividades = fluxoAtividades;
    }

    public String getApresentacao() {
        return apresentacao;
    }

    public void setApresentacao(String apresentacao) {
        this.apresentacao = apresentacao;
    }

    public String getIntroducao() {
        return introducao;
    }

    public void setIntroducao(String introducao) {
        this.introducao = introducao;
    }

    public String getQuandoAplicar() {
        return quandoAplicar;
    }

    public void setQuandoAplicar(String quandoAplicar) {
        this.quandoAplicar = quandoAplicar;
    }

    public String getReferencias() {
        return referencias;
    }

    public void setReferencias(String referencias) {
        this.referencias = referencias;
    }
}
