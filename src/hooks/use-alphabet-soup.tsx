import { useState } from "react";
import _ from 'lodash';
import { FormDataKeys } from "../types/form-data-keys.enum";
import { FormStatus } from "../types/form-status.enum";

export function useAlphabetSoup() {
  const [formData, setFormData] = useState<Record<FormDataKeys, string>>({
    [FormDataKeys.Cols]: '10',
    [FormDataKeys.Rows]: '10',
    [FormDataKeys.Search]: '',
  });
  const [formStatus, setFormStatus] = useState(FormStatus.FillColsAndRows);
  const [alphabetSoup, setAlphabetSoup] = useState<string[][]>([]);

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
    setFormStatus(FormStatus.FillColsAndRows);
  }

  const saveAlphabetSoup = () => {
    if (alphabetSoup.some((row) => row.some((col) => col === ''))) {
      return alert('All fields are required')
    }

    setFormStatus(FormStatus.FilledAlphabetSoup);
  }

  return {
    renderInputNumbers,
    createAlphabetSoup,
    alphabetSoup,
    fillFieldOfLetterSoup,
    formData,
    formStatus,
    resetForm,
    saveAlphabetSoup,
  }
}