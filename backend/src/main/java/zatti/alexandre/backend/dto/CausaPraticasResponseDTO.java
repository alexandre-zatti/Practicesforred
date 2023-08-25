package zatti.alexandre.backend.dto;

import zatti.alexandre.backend.model.AreaGestao;

import java.util.ArrayList;
import java.util.List;

public class CausaPraticasResponseDTO {
    private AreaGestao areaGestao;
    private List<PraticaGeralDTO> praticasGerais;

    public CausaPraticasResponseDTO(AreaGestao areaGestao) {
        this.areaGestao = areaGestao;
        this.praticasGerais = new ArrayList<>();
    }

    public CausaPraticasResponseDTO(AreaGestao areaGestao, List<PraticaGeralDTO> praticasGerais) {
        this.areaGestao = areaGestao;
        this.praticasGerais = praticasGerais;
    }

    public AreaGestao getAreaGestao() {
        return areaGestao;
    }

    public void setAreaGestao(AreaGestao areaGestao) {
        this.areaGestao = areaGestao;
    }

    public List<PraticaGeralDTO> getPraticasGerais() {
        return praticasGerais;
    }

    public void setPraticasGerais(List<PraticaGeralDTO> praticasGerais) {
        this.praticasGerais = praticasGerais;
    }

    public void addPraticaGeral(PraticaGeralDTO praticaGeral) {
        this.praticasGerais.add(praticaGeral);
    }
}
