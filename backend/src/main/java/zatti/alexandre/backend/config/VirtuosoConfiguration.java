package zatti.alexandre.backend.config;

import org.apache.jena.query.Dataset;
import org.apache.jena.query.DatasetFactory;
import org.apache.jena.rdf.model.Model;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import virtuoso.jena.driver.VirtGraph;
import virtuoso.jena.driver.VirtModel;

@Configuration
public class VirtuosoConfiguration {

    @Value("${virtuoso.jdbc.url}")
    private String jdbcUrl;

    @Value("${virtuoso.jdbc.user}")
    private String jdbcUser;

    @Value("${virtuoso.jdbc.password}")
    private String jdbcPassword;

    @Value("${virtuoso.graph}")
    private String defaultGraph;

    @Bean
    public VirtGraph virtGraph() {
        return new VirtGraph(defaultGraph, jdbcUrl, jdbcUser, jdbcPassword);
    }

    @Bean
    public Dataset dataset(VirtGraph virtGraph) {
        Model model = new VirtModel(virtGraph);
        return DatasetFactory.create(model);
    }

}

