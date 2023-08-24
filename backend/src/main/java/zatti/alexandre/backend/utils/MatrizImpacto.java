package zatti.alexandre.backend.utils;

import zatti.alexandre.backend.enums.GrauRelevancia;

public class MatrizImpacto {
    public static final GrauRelevancia[][] MATRIZ = {
            {GrauRelevancia.MEDIO, GrauRelevancia.ALTO, GrauRelevancia.ALTO},
            {GrauRelevancia.BAIXO, GrauRelevancia.MEDIO, GrauRelevancia.ALTO},
            {GrauRelevancia.BAIXO, GrauRelevancia.BAIXO, GrauRelevancia.MEDIO}
    };

    public MatrizImpacto() {
    }
}
