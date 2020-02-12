import React, { useState } from "react";
import {
  Button,
  InputGroup,
  Intent,
  Menu,
  MenuItem,
  Tag,
  TextArea,
  Popover,
  Position
} from "@blueprintjs/core";
import "./App.css";

function App() {
  const [isEdit, setIsEdit] = useState(true);
  const [text, setText] = useState("");
  const [selectionText, setSelectionText] = useState("");
  const [selectionIndex, setSelectionIndex] = useState([0, 0]);
  const [tags, setTags] = useState([]);

  const handleSelection = () => {
    const textarea = document.getElementById("textarea");
    const selection = window.getSelection();
    setSelectionText(selection.toString());
    setSelectionIndex([textarea.selectionStart, textarea.selectionEnd]);
  };

  const handleTag = color => {
    setTags(
      [
        ...tags,
        {
          label: selectionText,
          color: color,
          index: selectionIndex
        }
      ].sort(compare)
    );
    setSelectionText("");
    setSelectionIndex([0, 0]);
  };

  const compare = (a, b) => {
    const A = a.index[0];
    const B = b.index[0];

    let comparison = 0;
    if (A > B) {
      comparison = 1;
    } else if (A < B) {
      comparison = -1;
    }
    return comparison;
  };

  const TagMenu = (
    <Popover
      content={
        <Menu>
          <MenuItem text="Tag Red" onClick={() => handleTag("danger")} />
          <MenuItem text="Tag Blue" onClick={() => handleTag("primary")} />
        </Menu>
      }
      position={Position.BOTTOM_RIGHT}
    >
      <Button minimal={true} rightIcon="caret-down">
        Tag
      </Button>
    </Popover>
  );

  const createHTMLText = () => {
    if(text === "") {
      return "Nothing here... Please enter Remarks."
    }
    let output = "";
    let index = 0;
    tags.forEach(tag => {
      output =
        output +
        text.substring(index, tag.index[0]) +
        `<span class="bp3-tag bp3-intent-${tag.color}"><span class="bp3-text-overflow-ellipsis bp3-fill">` +
        text.substring(tag.index[0], tag.index[1]) +
        `</span></span>`;
      index = tag.index[1];
    });
    output = output + text.substring(index);
    return output;
  };

  return (
    <div className="App-header">
      <div className="Container">
        {isEdit ? (
          <>
            <InputGroup
              disabled={selectionText === ""}
              large
              placeholder="Select text to tag..."
              rightElement={TagMenu}
              value={selectionText}
              style={{ flex: 1 }}
            />
            <TextArea
              id="textarea"
              placeholder="Remarks..."
              growVertically={true}
              large={true}
              intent={Intent.PRIMARY}
              onChange={event => setText(event.target.value)}
              value={text}
              style={{ width: "100%", marginTop: "1rem" }}
              onMouseUp={handleSelection}
              onKeyUp={handleSelection}
            />
            <div className="Tags-container">
              <div>
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    intent={
                      tag.color === "danger" ? Intent.DANGER : Intent.PRIMARY
                    }
                    onRemove={() =>
                      setTags(
                        tags.filter((value, tagindex) => tagindex !== index)
                      )
                    }
                    className="Tag"
                  >
                    {tag.label}
                  </Tag>
                ))}
              </div>
              <div>
                <Tag>{`${selectionIndex[0]} / ${selectionIndex[1]}`}</Tag>
              </div>
            </div>
            <Button
              onClick={() => setIsEdit(false)}
              style={{ marginTop: "2rem" }}
            >
              Done
            </Button>
          </>
        ) : (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: createHTMLText() }}
              className="Text-container"
            />
            <Button
              onClick={() => setIsEdit(true)}
              style={{ marginTop: "2rem" }}
            >
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
