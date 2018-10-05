#!/bin/bash

cat questions.json | jq -r '.[] | .href + "\t" + .text' | while IFS=$'\t' read -r -a line; do
   href=${line[0]} && text=${line[1]}
   content=$(node briefmenow_question_data.js --question-url $href | jq -c '.')   
   filename=$(echo $content | node sha-512.js)
   echo $content > "questions/"$filename".json"
   echo $filename".json"
done

