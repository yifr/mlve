# Generating experiment configs
1. Batch data into json files that contain a key for `trials`, `metadata`, `iterationName`
2. Either: using port forwarding to connect to the lab's EC2 instance, upload files to MongoDB under the schema:
    <db=project>/<collection=domain_experiment> (ie; db="mlve", collection="gestalt_static_localization")
    For batching, each record in the collection will be treated equally 
    
    OR
    add the json files to git, push to master. On the EC2 server, pull from git and use a script to add the json records to mongo
