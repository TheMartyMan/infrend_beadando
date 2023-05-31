import { DatabaseData } from "./data-source"
import express from 'express';
import { getRoutes } from "./routes";

DatabaseData.initialize().then(async () => {
    const app = express();
    
    app.use(express.json());


    app.use('/api', getRoutes());


    app.listen(3000, () => {
        console.log('Szerver nyitva a 3000-es portra ...');
    });

}).catch(error => console.log(error))
