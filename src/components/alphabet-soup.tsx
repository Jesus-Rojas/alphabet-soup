import { FormDataKeys } from "../types/form-data-keys.enum";
import { useAlphabetSoup } from "../hooks/use-alphabet-soup";
import styles from './alphabet-soup.module.scss'
import { FormStatus } from "../types/form-status.enum";

export function AlphabetSoup() {
  const {
    createAlphabetSoup,
    renderInputNumbers,
    alphabetSoup,
    fillFieldOfLetterSoup,
    formData,
    formStatus,
    resetForm,
    saveAlphabetSoup,
    renderSearch,
  } = useAlphabetSoup();

  return (
    <>
      {renderInputNumbers(FormDataKeys.Cols, 'Cols', styles['input'])}
      <br />
      {renderInputNumbers(FormDataKeys.Rows, 'Rows', styles['input'])}
      <br />
      {formStatus === FormStatus.FilledAlphabetSoup && renderSearch(styles['input'])}
      <br />
      <button
        onClick={createAlphabetSoup}
        disabled={formStatus !== FormStatus.FillColsAndRows}
      >
        Create alphabet soup
      </button>
      &nbsp; &nbsp;
      <button
        onClick={saveAlphabetSoup}
        disabled={formStatus !== FormStatus.CreatedAlphabetSoup}
      >
        Save alphabet soup
      </button>
      &nbsp; &nbsp;
      <button
        onClick={resetForm}
      >
        Reset
      </button>
      <br />
      <br />
      {formStatus !== FormStatus.FillColsAndRows && (
        <div
          className={styles['container-alphabet-group']}
          style={{
            '--cols': formData[FormDataKeys.Cols],
            '--rows': formData[FormDataKeys.Rows],
          }}
        >
          {alphabetSoup.map((row, indexRow) => row.map((col, indexCol) => (
            <input
              type="text"
              value={col}
              disabled={formStatus !== FormStatus.CreatedAlphabetSoup}
              onChange={(e) => fillFieldOfLetterSoup(e.currentTarget.value, indexRow, indexCol)}
              key={`col-${indexRow}-${indexCol}`}
            />
          )))}

        </div>
      )}
    </>
  )
}
