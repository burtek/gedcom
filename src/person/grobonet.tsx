export const renderLink = (children: React.ReactNode, searchName: SearchName) => (searchName
    ? (
        <a
            href="https://grobonet.com/index.php?page=wyszukiwanie&imie=Kazimierz&nazw=Sk%C4%99pski&wojewodztwo=&miasto="
            target="_blank"
            rel="noopener noreferrer"
        >
            {children}
        </a>
    )
    : children);

export type SearchName = undefined | { name: string; surname: string };
