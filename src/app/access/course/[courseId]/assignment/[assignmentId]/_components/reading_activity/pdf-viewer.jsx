import React, { useState, useEffect, useCallback } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  Popup,
  AreaHighlight,
} from 'react-pdf-highlighter';
// @ts-ignore
import { NewHighlight } from 'react-pdf-highlighter';
import { testHighlights } from './test-highlights';

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = '';
};

// @ts-ignore
const HighlightPopup = (comment) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

// const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
// const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

// @ts-ignore
const PDFViewer = (props) => {

  console.log(props);

  const [url, setUrl] = useState(props.url);
  const [highlights, setHighlights] = useState(
    // @ts-ignore
    testHighlights[props.url] ? [...testHighlights[props.url]] : []
  );

  // @ts-ignore
  let scrollViewerTo = useCallback((highlight) => {
    // Scroll logic here
  }, []);

  const scrollToHighlightFromHash = useCallback(() => {
    // @ts-ignore
    const highlight = highlights.find((h) => h.id === parseIdFromHash());
    if (highlight) {
      scrollViewerTo(highlight);
    }
  }, [highlights, scrollViewerTo]);

  useEffect(() => {
    const handleHashChange = () => {
      scrollToHighlightFromHash();
    };

    window.addEventListener('hashchange', handleHashChange, false);

    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, [scrollToHighlightFromHash]);

  // @ts-ignore
  const addHighlight = (highlight) => {
    console.log('Saving highlight', highlight);
    setHighlights([{ ...highlight, id: getNextId() }, ...highlights]);
  };

  // @ts-ignore
  const updateHighlight = (highlightId, position, content) => {
    console.log('Updating highlight', highlightId, position, content);
    // @ts-ignore
    setHighlights(highlights.map((h) => {
      if (h.id === highlightId) {
        return { ...h, position: { ...h.position, ...position }, content: { ...h.content, ...content }};
      }
      return h;
    }));
  };

  return (
    <div className="h-full overflow-auto w-full">
      <PdfLoader url={url} beforeLoad={<span className="loading loading-spinner loading-lg"></span>}>
        {(pdfDocument) => (
          <PdfHighlighter
            pdfDocument={pdfDocument}
            enableAreaSelection={(event) => event.altKey}
            onScrollChange={resetHash}
            scrollRef={(scrollTo) => {
              // @ts-ignore
              scrollViewerTo = scrollTo;
              scrollToHighlightFromHash();
            }}
            onSelectionFinished={(
              position,
              content,
              hideTipAndSelection,
              transformSelection
            ) => (
              <Tip
                onOpen={transformSelection}
                onConfirm={(comment) => {
                  addHighlight({ content, position, comment });
                  hideTipAndSelection();
                }}
              />
            )}
            highlightTransform={(
              highlight,
              index,
              setTip,
              hideTip,
              viewportToScaled,
              screenshot,
              isScrolledTo
            ) => {
              const isTextHighlight = !Boolean(
                highlight.content && highlight.content.image)
            const component = isTextHighlight ? (
                <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                />
                ) : (
                <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                    updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                    );
                    }}
                />
                );

                return (
                <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                    // @ts-ignore
                    setTip(highlight, (highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                />
                );
            }}
            highlights={highlights}
            />
        )}
        </PdfLoader>
    </div>
    );
};

export default PDFViewer;

