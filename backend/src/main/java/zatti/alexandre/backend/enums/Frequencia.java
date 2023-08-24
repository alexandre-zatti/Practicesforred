package zatti.alexandre.backend.enums;

public enum Frequencia {
    EVENTUALMENTE(2),
    PARCIALMENTE(1),
    FREQUENTEMENTE(0);

    private final int value;

    Frequencia(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
