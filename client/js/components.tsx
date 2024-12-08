/*
  Copyright 2017-2018 James V. Craster
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import * as React from "react";
import { User } from "./client";

type Props = {
  name: string;
  type: string;
  ranked: boolean;
  uid: string;
};

export const LobbyItem: React.FC<Props> = ({ name, type, ranked, uid }) => {
  return (
    <div
      className="lobbyItem"
      data-inplay="false"
      data-name={name}
      data-type={type}
      data-ranked={ranked}
      data-uid={uid}
    >
      <div className="lobbyItemHeader">
        <p>
          <span className="gameName">{name}</span>
          <span className="inPlay"> OPEN </span>
        </p>
      </div>
      <p className="lobbyItemBody">
        {"Players: "}
        <span />
        <span id="gameType">{type}</span>
      </p>
    </div>
  );
};

type Role = {
  roleName: string;
  color: string;
};

type RoleSelectionProps = {
  user: User;
};


const RoleSelection: React.FC<RoleSelectionProps> = ({ user }) => {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [roleNames, setRoleNames] = React.useState<string[]>([]);
  const [display, setDisplay] = React.useState("none");

  const handleRoleClick = (roleName: string) => {
    setRoleNames(prev => [...prev, roleName]);
  };

  const addButtons = React.useCallback((newRoles: Role[]) => {
    setRoles(newRoles);
    setDisplay("inherit");
  }, []);

  return (
    <div
      className="header"
      style={{
        maxHeight: "60%",
        overflowY: "scroll",
        display: display,
        paddingBottom: "5px",
        marginTop: "100px",
        paddingLeft: "5px",
        left: "35%",
        backgroundColor: "#212121",
        color: "#cecece",
        fontFamily: "IBM Sans Plex', sans-serif",
        fontSize: "20px",
        width: "30%",
        position: "absolute",
        border: "2px solid black",
      }}
    >
      <p>You are the host. Role selection:</p>
      <br />
      <div className="ui form">
        <h4>Default</h4>
        <p>
          Pressing the default button will start with the default rolelist (if
          there are enough players):
        </p>
        <button
          className="ui blue button"
          onClick={() => user.socket.emit("useDefaultRoleList")}
          disabled
        >
          Default
        </button>
        <br /> 
        <h4>Custom</h4>
        <p>
          Select as many roles as you have players, then hit submit to start:
        </p>
        <div id="allRolesForGameType">
          {roles.map((role, index) => (
            <button
              key={index}
              className="ui blue button"
              onClick={() => handleRoleClick(role.roleName)}
              style={{ backgroundColor: role.color }}
            >
              {role.roleName}
            </button>
          ))}
        </div>
        <br />
        <button
          className="ui blue button"
          onClick={() => user.socket.emit("supplyRoleList", roleNames)}
          disabled
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
