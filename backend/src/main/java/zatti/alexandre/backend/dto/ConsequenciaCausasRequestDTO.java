package zatti.alexandre.backend.dto;

public class ConsequenciaCausasRequestDTO {
    private String consequenciaUri;
    private String consequenciaNome;

    public String getConsequenciaUri() {
        return consequenciaUri;
    }

    public void setConsequenciaUri(String consequenciaUri) {
        this.consequenciaUri = consequenciaUri;
    }

    public String getConsequenciaNome() {
        return consequenciaNome;
    }

    public void setConsequenciaNome(String consequenciaNome) {
        this.consequenciaNome = consequenciaNome;
    }
}
