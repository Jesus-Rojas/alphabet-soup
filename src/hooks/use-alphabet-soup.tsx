import { useState } from "react";
import _ from 'lodash';
import { FormDataKeys } from "../types/form-data-keys.enum";
import { FormStatus } from "../types/form-status.enum";
import * as alphabetSoupMock from "../mocks/alphabet-soup.mock";
import { Combinations } from "../types/combinations.enum";
import { toast } from 'sonner'


export function useAlphabetSoup() {
  const [formData, setFormData] = useState<Record<FormDataKeys, string>>({
    [FormDataKeys.Cols]: '' || alphabetSoupMock.cols,
    [FormDataKeys.Rows]: '' || alphabetSoupMock.rows,
    [FormDataKeys.Search]: '',
  });
  const [formStatus, setFormStatus] = useState(FormStatus.FillColsAndRows);
  const [alphabetSoup, setAlphabetSoup] = useState<string[][]>([] || alphabetSoupMock.alphabetSoup);
  const [combinations, setCombinations] = useState<Record<Combinations, string[]>>({
    [Combinations.Horizontally]: [],
    [Combinations.HorizontallyInverted]: [],
    [Combinations.Vertical]: [],
    [Combinations.VerticalInverted]: [],
    [Combinations.Diagonal_UTD_LTR]: [],
    [Combinations.Diagonal_UTD_RTL]: [],
    [Combinations.Diagonal_DTU_LTR]: [],
    [Combinations.Diagonal_DTU_RTL]: [],
  });

  const updateFormData = (value: string, key: FormDataKeys) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  const renderInputNumbers = (key: FormDataKeys, text: string, classInput: string) => (
    <div>
      { text }: &nbsp; &nbsp; &nbsp;
      <input
        type="text"
        value={formData[key]}
        className={classInput}
        onChange={(e) => updateFormData(e.target.value, key)}
        disabled={formStatus !== FormStatus.FillColsAndRows}
      />
    </div>
  );

  const createAlphabetSoup = () => {
    const cols = +formData[FormDataKeys.Cols];
    const rows = +formData[FormDataKeys.Rows];
    if (
      cols === 0 ||
      rows === 0 ||
      [cols, rows].some((number) => isNaN(number) || number <= 0)
    ) {
      return toast.error('Verify (cols, rows). Both should be numbers and should be more than zero');
    }

    setAlphabetSoup(new Array(rows).fill('').map(() => new Array(cols).fill('')));
    setFormStatus(FormStatus.CreatedAlphabetSoup);
  }

  const fillFieldOfLetterSoup = (value: string, indexRow: number, indexCol: number) => {
    const newAlphabetSoup = _.cloneDeep(alphabetSoup);
    newAlphabetSoup[indexRow][indexCol] = value.length ? value[0] : '';
    setAlphabetSoup(newAlphabetSoup);
  }

  const resetForm = () => setFormStatus(FormStatus.FillColsAndRows);

  const parseData = (array: string[][]) => (
    array.reduce<[ Words: string[], WordsInverted: string[]]>((
      [ words, wordsInverted ], row
    ) => {
      const rowString = row.join('').toLowerCase();
      const rowStringInverted = [...row].reverse().join('').toLowerCase();
      return [
        [...words, rowString ],
        [...wordsInverted, rowStringInverted ],
      ];
    }, [[], []])
  );

  const extractDiagonalsFromMatrix = (matrix: string[][]) => {
    const numberOfColumns = matrix[0].length;
    const numberOfRows = matrix.length;

    /**
     * U -> Up
     * T -> To
     * D -> Down
     * L -> Left
     * R -> Right
    */

    let diagonalUTDLTR: string[] = [];
    let diagonalDTULTR: string[] = [];
  
    const collectDiagonalWords = (data: string[][], diagonalOffset: number, isSecondary = false) => (
      Array
        .from({ length: data.length }, (__, rowIndex) => {
          const columnIndex = rowIndex + diagonalOffset;
          if (!(columnIndex >= 0 && columnIndex < numberOfColumns)) return '';
          return data[isSecondary ? (data.length - 1 - rowIndex) : rowIndex][columnIndex];
        })
        .filter(char => char !== '')
        .join('')
        .toLowerCase()
    );

    const reverseWordsFromArray = (data: string[]) => (
      data.map((word) => word.split('').reverse().join(''))
    );
  
    for (let diagonalOffset = -numberOfRows + 1; diagonalOffset < numberOfColumns; diagonalOffset++) {
      const primaryDiagonalLTR = collectDiagonalWords(matrix, diagonalOffset);
      const secondaryDiagonalLTR = collectDiagonalWords(matrix, diagonalOffset, true);
      if (primaryDiagonalLTR) diagonalUTDLTR.push(primaryDiagonalLTR);
      if (secondaryDiagonalLTR) diagonalDTULTR.push(secondaryDiagonalLTR);
    }

    const diagonalUTDRTL = reverseWordsFromArray(diagonalDTULTR);
    const diagonalDTURTL = reverseWordsFromArray(diagonalUTDLTR);

    return {
      diagonalUTDLTR,
      diagonalDTULTR,
      diagonalUTDRTL,
      diagonalDTURTL
    };
  };

  const generateCombinations = () => {
    const [horizontally, horizontallyInverted] = parseData(alphabetSoup);
    const [vertical, verticalInverted] = parseData(_.zip(...alphabetSoup) as string[][]);
    const {
      diagonalDTULTR,
      diagonalDTURTL,
      diagonalUTDLTR,
      diagonalUTDRTL,
    } = extractDiagonalsFromMatrix(alphabetSoup);

    setCombinations({
      [Combinations.Horizontally]: horizontally,
      [Combinations.HorizontallyInverted]: horizontallyInverted,
      [Combinations.Vertical]: vertical,
      [Combinations.VerticalInverted]: verticalInverted,
      [Combinations.Diagonal_DTU_LTR]: diagonalDTULTR,
      [Combinations.Diagonal_DTU_RTL]: diagonalDTURTL,
      [Combinations.Diagonal_UTD_LTR]: diagonalUTDLTR,
      [Combinations.Diagonal_UTD_RTL]: diagonalUTDRTL,
    });
  }

  const saveAlphabetSoup = () => {
    if (alphabetSoup.some((row) => row.some((col) => col === ''))) {
      return toast.error('All fields are required')
    }

    setFormStatus(FormStatus.FilledAlphabetSoup);
    generateCombinations();
  }

  const findWordInAlphabetSoup = () => {
    const wordToFind = formData[FormDataKeys.Search].toLowerCase();
    
    if (!wordToFind.length) return;

    const findWordInArray = (words: string[]) => (
      words.some((word) => word.includes(wordToFind))
    );


    for (const combinationKey of Object.keys(combinations)) {
      if (findWordInArray(combinations[combinationKey as Combinations])) {
        return toast.success(`Word was found "${combinationKey}"`);
      }
    }

    toast.error('Word not found');
  }

  const renderSearch = (classInput: string) => (
    <div>
      <input
        type="text"
        value={formData[FormDataKeys.Search]}
        className={classInput}
        onChange={(e) => updateFormData(e.target.value, FormDataKeys.Search)}
      />
      &nbsp; &nbsp;
      <button onClick={findWordInAlphabetSoup}>Search</button>
    </div>
  );

  return {
    renderInputNumbers,
    createAlphabetSoup,
    alphabetSoup,
    fillFieldOfLetterSoup,
    formData,
    formStatus,
    resetForm,
    saveAlphabetSoup,
    renderSearch,
  }
}