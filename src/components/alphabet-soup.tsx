import { FormDataKeys } from "../types/form-data-keys.enum";
import { useAlphabetSoup } from "../hooks/use-alphabet-soup";
import styles from './alphabet-soup.module.scss'

export function AlphabetSoup() {
  const {
    createAlphabetSoup,
    renderInputNumbers,
    alphabetSoup,
    fillFieldOfLetterSoup,
    formData,
  } = useAlphabetSoup();

  return (
    <>
      {renderInputNumbers(FormDataKeys.Cols, 'Cols')}
      <br />
      {renderInputNumbers(FormDataKeys.Rows, 'Rows')}
      <br />
      <button onClick={createAlphabetSoup}>Create alphabet soup</button>
      <br />
      <br />
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
            onChange={(e) => fillFieldOfLetterSoup(e.currentTarget.value, indexRow, indexCol)}
            key={`col-${indexRow}-${indexCol}`}
          />
        )))}

      </div>
    </>
  )
}
