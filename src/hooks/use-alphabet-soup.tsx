import { useState } from "react";
import _ from 'lodash';
import { FormDataKeys } from "../types/form-data-keys.enum";
import { FormStatus } from "../types/form-status.enum";
import * as alphabetSoupMock from "../mocks/alphabet-soup.mock";
import { Combinations } from "../types/combinations.enum";

export function useAlphabetSoup() {
  const [formData, setFormData] = useState<Record<FormDataKeys, string>>({
    [FormDataKeys.Cols]: alphabetSoupMock.cols,
    [FormDataKeys.Rows]: alphabetSoupMock.rows,
    [FormDataKeys.Search]: '',
  });
  const [formStatus, setFormStatus] = useState(FormStatus.FilledAlphabetSoup);
  const [alphabetSoup, setAlphabetSoup] = useState<string[][]>(alphabetSoupMock.alphabetSoup);
  const [combinations, setCombinations] = useState<Record<Combinations, string[]>>({
    [Combinations.Horizontally]: [],
    [Combinations.HorizontallyInverted]: [],
    [Combinations.Vertical]: [],
    [Combinations.VerticalInverted]: [],
  });

  const updateFormData = (value: string, key: FormDataKeys) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  const renderInputNumbers = (key: FormDataKeys, text: string) => (
    <div>
      { text }: {' '}
      <input
        type="text"
        value={formData[key]}
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
      return alert('Verify (cols, rows). Both should be numbers and should be more than zero');
    }

    setAlphabetSoup(new Array(rows).fill('').map(() => new Array(cols).fill('')));
    setFormStatus(FormStatus.CreatedAlphabetSoup);
  }

  const fillFieldOfLetterSoup = (value: string, indexRow: number, indexCol: number) => {
    const newAlphabetSoup = _.cloneDeep(alphabetSoup);
    newAlphabetSoup[indexRow][indexCol] = value.length ? value[0] : '';
    setAlphabetSoup(newAlphabetSoup);
  }

  const resetForm = () => {
    generateCombinations()
    return;
    setFormStatus(FormStatus.FillColsAndRows);
  }

  const generateCombinations = () => {
    const [horizontally, horizontallyInverted] = alphabetSoup
      .reduce<[ Horizontally: string[], HorizontallyInverted: string[]]>((
        [ horizontally, horizontallyInverted ], row
      ) => {
        const rowString = row.join('').toLowerCase();
        const rowReverseString = [...row].reverse().join('').toLowerCase();

        return [
          [...horizontally, rowString ],
          [...horizontallyInverted, rowReverseString ],
        ];
      }, [[], []]);

    // const [vertical, verticalInverted] = alphabetSoup
    //   .reduce<[ Horizontally: string[], HorizontallyInverted: string[]]>((
    //     [ vertical, verticalInverted ], row
    //   ) => {
    //     const rowString = row.join('').toLowerCase();
    //     const rowReverseString = [...row].reverse().join('').toLowerCase();

    //     return [
    //       [...vertical, rowString ],
    //       [...verticalInverted, rowReverseString ],
    //     ];
    //   }, [[], []]);

    setCombinations((prevState) => ({
      ...prevState,
      [Combinations.Horizontally]: horizontally,
      [Combinations.HorizontallyInverted]: horizontallyInverted,
    }));
    
    
  }

  const saveAlphabetSoup = () => {
    if (alphabetSoup.some((row) => row.some((col) => col === ''))) {
      return alert('All fields are required')
    }

    setFormStatus(FormStatus.FilledAlphabetSoup);
    generateCombinations();
  }

  const findWordInAlphabetSoup = () => {
    return;
    const search = formData[FormDataKeys.Search].toLowerCase();
    const wasFoundInHorizontally = alphabetSoup.some((row) => {
      const rowString = row.join('').toLowerCase();
      
      if (rowString.includes(search)) {
        alert('Word found horizontally');
        return true;
      };
      
      const rowReverseString = [...row].reverse().join('').toLowerCase();
      if (rowReverseString.includes(search)) {
        alert('Word found horizontally (upside down)');
        return true;
      };
    });

    const wasFound = [
      wasFoundInHorizontally,
    ];
    
    if (!wasFound.some((value) => value)) return alert('Word not found');
  }

  const renderSearch = () => (
    <div>
      <input
        type="text"
        value={formData[FormDataKeys.Search]}
        onChange={(e) => updateFormData(e.target.value, FormDataKeys.Search)}
      />
      {' '}
      <button onClick={findWordInAlphabetSoup}>Search</button>
    </div>
  );

  // console.log(combinations);


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