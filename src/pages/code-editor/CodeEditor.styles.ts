import styled from 'styled-components'

export const CodeEditorContainer = styled.div<{ $isVisible: boolean }>`
  display: ${(p) => (p['$isVisible'] ? 'block' : 'none')};
  padding: 10px;

  .monaco-editor .scroll-decoration {
    display: none !important;
  }

  /** line numbers */
  .margin-view-overlays .line-numbers {
    color: deeppink !important;
  }

  .zone-widget-container {
    margin: 10px;
    border: 1px solid rgb(55, 148, 255);
    top: -3px !important;

    .decorationsOverviewRuler {
      display: none !important;
    }

    .current-line.current-line-exact {
      border: 1px solid #385160;
      width: 98% !important;
    }

    /** Code Preview */
    .overflow-guard {
      .margin-view-overlays {
        .line-numbers {
          font-size: 12px !important;
          color: white !important;
        }
      }

      .view-line {
        font-size: 12px !important;
      }

      .squiggly-error {
        display: none !important;
      }
    }

    /** Other matching  files, list */
    .monaco-list-rows {
      font-size: 12px;

      .count {
        display: none !important;
      }
    }

    .monaco-tl-twistie.collapsible {
      margin-right: 8px !important;
    }

    .monaco-icon-description-container {
      display: none !important;
    }
  }
`

export const EditorWrapper = styled.div`
  border: 2px solid deeppink;
  padding-top: 20px;
  background-color: #1e1e1e;
`

export const FileButton = styled.div`
  background-color: deeppink;
  color: white;
  padding: 5px 10px;
  display: inline-block;
  margin-right: 20px;
  letter-spacing: 1px;
  cursor: pointer;
`

export const ExecuteButton = styled(FileButton)`
  background-color: #3dc9b0;
`
