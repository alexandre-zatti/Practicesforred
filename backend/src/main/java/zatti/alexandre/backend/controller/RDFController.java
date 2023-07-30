package zatti.alexandre.backend.controller;

import org.apache.jena.query.Dataset;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.StringReader;

@RestController
@RequestMapping("/api")
public class RDFController {

    private final Dataset dataset;

    @Autowired
    public RDFController(Dataset dataset) {
        this.dataset = dataset;
    }

    @PostMapping("/load")
    public ResponseEntity<String> loadRdf(@RequestParam("file") MultipartFile file) {
        try {
            // Clearing existing data
            dataset.getDefaultModel().removeAll();

            // Convert MultipartFile to String
            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            // Loading new data
            Model model = ModelFactory.createDefaultModel();
            model.read(new StringReader(sb.toString()), null, "RDF/XML"); // Specify the correct RDF language
            dataset.getDefaultModel().add(model);
            return new ResponseEntity<>("Data loaded successfully.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error loading data: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
