#!/bin/bash
#SBATCH --job-name s3_upload
#SBATCH --mail-type=FAIL,END
#SBATCH --mail-user=yyf@mit.edu
#SBATCH -t 94:00:00
#SBATCH -N 1
#SBATCH -p normal
#SBATCH --mem=5G

python upload_to_s3.py
