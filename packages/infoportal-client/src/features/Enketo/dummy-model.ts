export const dummyModel = `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:jr="http://openrosa.org/javarosa" xmlns:odk="http://www.opendatakit.org/xforms" xmlns:orx="http://openrosa.org/xforms" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <h:head>
    <h:title>[SANDBOX] Nested repeat</h:title>
    <model odk:xforms-version="1.0.0">
      <instance>
        <apn6HTbCJgwzrrGAywJdp2 id="apn6HTbCJgwzrrGAywJdp2">
          <start/>
          <family>
            <family_name/>
            <children jr:template="">
              <children_name/>
              <grandchildren jr:template="">
                <grandchildren_name/>
                <grand-grandchildren jr:template="">
                  <grand-grandchildren_name/>
                </grand-grandchildren>
              </grandchildren>
              <grandchildren2 jr:template="">
                <grandchildren2_name/>
              </grandchildren2>
            </children>
            <children>
              <children_name/>
              <grandchildren>
                <grandchildren_name/>
                <grand-grandchildren>
                  <grand-grandchildren_name/>
                </grand-grandchildren>
              </grandchildren>
              <grandchildren2>
                <grandchildren2_name/>
              </grandchildren2>
            </children>
            <cousin jr:template="">
              <cousin_name/>
            </cousin>
            <cousin>
              <cousin_name/>
            </cousin>
          </family>
          <meta>
            <instanceID/>
          </meta>
        </apn6HTbCJgwzrrGAywJdp2>
      </instance>
      <bind jr:preload="timestamp" jr:preloadParams="start" nodeset="/apn6HTbCJgwzrrGAywJdp2/start" type="dateTime"/>
      <bind nodeset="/apn6HTbCJgwzrrGAywJdp2/family/family_name" type="string"/>
      <bind nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children/children_name" type="string"/>
      <bind nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren/grandchildren_name" type="string"/>
      <bind nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren/grand-grandchildren/grand-grandchildren_name" type="string"/>
      <bind nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren2/grandchildren2_name" type="string"/>
      <bind nodeset="/apn6HTbCJgwzrrGAywJdp2/family/cousin/cousin_name" type="string"/>
      <bind jr:preload="uid" nodeset="/apn6HTbCJgwzrrGAywJdp2/meta/instanceID" readonly="true()" type="string"/>
    </model>
  </h:head>
  <h:body>
    <group ref="/apn6HTbCJgwzrrGAywJdp2/family">
      <label>Family</label>
      <input ref="/apn6HTbCJgwzrrGAywJdp2/family/family_name">
        <label>Family_name</label>
      </input>
      <group ref="/apn6HTbCJgwzrrGAywJdp2/family/children">
        <label></label>
        <repeat nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children">
          <input ref="/apn6HTbCJgwzrrGAywJdp2/family/children/children_name">
            <label>Children_name</label>
          </input>
          <group ref="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren">
            <label></label>
            <repeat nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren">
              <input ref="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren/grandchildren_name">
                <label>grandchildren_name</label>
              </input>
              <group ref="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren/grand-grandchildren">
                <label>Grand-grandchildren</label>
                <repeat nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren/grand-grandchildren">
                  <input ref="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren/grand-grandchildren/grand-grandchildren_name">
                    <label>grand-grandchildren_name</label>
                  </input>
                </repeat>
              </group>
            </repeat>
          </group>
          <group ref="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren2">
            <label></label>
            <repeat nodeset="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren2">
              <input ref="/apn6HTbCJgwzrrGAywJdp2/family/children/grandchildren2/grandchildren2_name">
                <label>grandchildren2_name</label>
              </input>
            </repeat>
          </group>
        </repeat>
      </group>
      <group ref="/apn6HTbCJgwzrrGAywJdp2/family/cousin">
        <label></label>
        <repeat nodeset="/apn6HTbCJgwzrrGAywJdp2/family/cousin">
          <input ref="/apn6HTbCJgwzrrGAywJdp2/family/cousin/cousin_name">
            <label>cousin_name</label>
          </input>
        </repeat>
      </group>
    </group>
  </h:body>
</h:html>`