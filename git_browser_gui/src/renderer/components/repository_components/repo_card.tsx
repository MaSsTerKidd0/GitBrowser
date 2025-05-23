import React from "react";
import Box from "@mui/material/Box";
import styles from "../../Styles/repository_components_styles/RepoCardList.module.css"

type RepoProps = {
  repo_name: string;
};

type RepoCardListProps = {
  repos: RepoProps[];
};

export function RepoCardList({ repos }: RepoCardListProps) {
  return (
    <div>
      <Box className={styles.repo_lib}>
      {repos.map((repo) => (
        
        <Box className={styles.repo_card_container}>
          <Box key={repo.repo_name} className={styles.repo_title}>
            {repo.repo_name}
          </Box>
        </Box>
        
      ))}
      </Box>
    </div>
  );
}

