import React, {useState} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '@/shared'
import {Api} from '@infoportal/api-sdk'
import {OdkWebFormWrapper} from '@/shared/OdkWebFormWrapper.js'
import {OdkWebForm} from '@infoportal/odk-web-form-wrapper'

export const FormBuilderPreview = ({schema}: {schema?: Api.Form.Schema}) => {
  const {m} = useI18n()

  const [state, setState] = useState(1)
  return (
    <Core.Panel>
      <Core.PanelHead>{m.preview}</Core.PanelHead>
      <Core.Btn onClick={() => setState(2)}>Switch</Core.Btn>
      <Core.PanelBody>
        <OdkWebForm formXml={state === 1 ? xformSimple : xformSimple2} onSubmit={_ => console.log('SUBMIT', _)} />
        {state}
        <pre>{state === 1 ? xformSimple : xformSimple2}</pre>
        {/*{schema && (*/}
        {/*  <XlsFormFiller*/}
        {/*    survey={schema as any}*/}
        {/*    hideActions*/}
        {/*    onSubmit={_ => {*/}
        {/*      console.log('HERE')*/}
        {/*      console.log(_)*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}
      </Core.PanelBody>
    </Core.Panel>
  )
}

export const xformSimple = `
<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:orx="http://openrosa.org/xforms" xmlns:odk="http://www.opendatakit.org/xforms">
  <h:head>
    <h:title>Simple</h:title>
    <model odk:xforms-version="1.0.0">
      <itext>
        <translation lang="En (en)" default="true()">
          <text id="cb8dn51-0">
            <value>Yes</value>
          </text>
          <text id="cb8dn51-1">
            <value>No</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qpick:label">
            <value>Pick</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qwhy:label">
            <value>Why</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/autofill:label">
            <value>Auto</value>
          </text>
        </translation>
        <translation lang="Es (es)">
          <text id="cb8dn51-0">
            <value>Si</value>
          </text>
          <text id="cb8dn51-1">
            <value>No</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qpick:label">
            <value>Eligir</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qwhy:label">
            <value>Porque</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/autofill:label">
            <value>Auto</value>
          </text>
        </translation>
      </itext>
      <instance>
        <a98G5n3sLwhYXXkjmdK33L id="a98G5n3sLwhYXXkjmdK33L">
          <start/>
          <end/>
          <qpick/>
          <qwhy/>
          <autofill/>
          <meta>
            <instanceID/>
          </meta>
        </a98G5n3sLwhYXXkjmdK33L>
      </instance>
      <instance id="cb8dn51">
        <root>
          <item>
            <itextId>cb8dn51-0</itextId>
            <name>yes</name>
          </item>
          <item>
            <itextId>cb8dn51-1</itextId>
            <name>no</name>
          </item>
        </root>
      </instance>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/start" jr:preload="timestamp" type="dateTime" jr:preloadParams="start"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/end" jr:preload="timestamp" type="dateTime" jr:preloadParams="end"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/qpick" type="string" required="true()"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/qwhy" type="string" relevant=" /a98G5n3sLwhYXXkjmdK33L/qpick  = 'yes'" required="true()"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/autofill" readonly="true()" type="string" required="false()" calculate="concat( /a98G5n3sLwhYXXkjmdK33L/qpick ,  /a98G5n3sLwhYXXkjmdK33L/qwhy )"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/meta/instanceID" type="string" readonly="true()" jr:preload="uid"/>
    </model>
  </h:head>
  <h:body>
    <select1 ref="/a98G5n3sLwhYXXkjmdK33L/qpick">
      <label ref="jr:itext('/a98G5n3sLwhYXXkjmdK33L/qpick:label')"/>
      <itemset nodeset="instance('cb8dn51')/root/item">
        <value ref="name"/>
        <label ref="jr:itext(itextId)"/>
      </itemset>
    </select1>
    <input ref="/a98G5n3sLwhYXXkjmdK33L/qwhy">
      <label ref="jr:itext('/a98G5n3sLwhYXXkjmdK33L/qwhy:label')"/>
    </input>
    <input ref="/a98G5n3sLwhYXXkjmdK33L/autofill">
      <label ref="jr:itext('/a98G5n3sLwhYXXkjmdK33L/autofill:label')"/>
    </input>
  </h:body>
</h:html>
`
export const xformSimple2 = `
<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:orx="http://openrosa.org/xforms" xmlns:odk="http://www.opendatakit.org/xforms">
  <h:head>
    <h:title>Simple</h:title>
    <model odk:xforms-version="1.0.0">
      <itext>
        <translation lang="En (en)" default="true()">
          <text id="cb8dn51-0">
            <value>Yes2</value>
          </text>
          <text id="cb8dn51-1">
            <value>No2</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qpick:label">
            <value>Pick</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qwhy:label">
            <value>Why</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/autofill:label">
            <value>Auto</value>
          </text>
        </translation>
        <translation lang="Es (es)">
          <text id="cb8dn51-0">
            <value>Si</value>
          </text>
          <text id="cb8dn51-1">
            <value>No</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qpick:label">
            <value>Eligir</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/qwhy:label">
            <value>Porque</value>
          </text>
          <text id="/a98G5n3sLwhYXXkjmdK33L/autofill:label">
            <value>Auto</value>
          </text>
        </translation>
      </itext>
      <instance>
        <a98G5n3sLwhYXXkjmdK33L id="a98G5n3sLwhYXXkjmdK33L">
          <start/>
          <end/>
          <qpick/>
          <qwhy/>
          <autofill/>
          <meta>
            <instanceID/>
          </meta>
        </a98G5n3sLwhYXXkjmdK33L>
      </instance>
      <instance id="cb8dn51">
        <root>
          <item>
            <itextId>cb8dn51-0</itextId>
            <name>yes</name>
          </item>
          <item>
            <itextId>cb8dn51-1</itextId>
            <name>no</name>
          </item>
        </root>
      </instance>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/start" jr:preload="timestamp" type="dateTime" jr:preloadParams="start"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/end" jr:preload="timestamp" type="dateTime" jr:preloadParams="end"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/qpick" type="string" required="true()"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/qwhy" type="string" relevant=" /a98G5n3sLwhYXXkjmdK33L/qpick  = 'yes'" required="true()"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/autofill" readonly="true()" type="string" required="false()" calculate="concat( /a98G5n3sLwhYXXkjmdK33L/qpick ,  /a98G5n3sLwhYXXkjmdK33L/qwhy )"/>
      <bind nodeset="/a98G5n3sLwhYXXkjmdK33L/meta/instanceID" type="string" readonly="true()" jr:preload="uid"/>
    </model>
  </h:head>
  <h:body>
    <select1 ref="/a98G5n3sLwhYXXkjmdK33L/qpick">
      <label ref="jr:itext('/a98G5n3sLwhYXXkjmdK33L/qpick:label')"/>
      <itemset nodeset="instance('cb8dn51')/root/item">
        <value ref="name"/>
        <label ref="jr:itext(itextId)"/>
      </itemset>
    </select1>
    <input ref="/a98G5n3sLwhYXXkjmdK33L/qwhy">
      <label ref="jr:itext('/a98G5n3sLwhYXXkjmdK33L/qwhy:label')"/>
    </input>
    <input ref="/a98G5n3sLwhYXXkjmdK33L/autofill">
      <label ref="jr:itext('/a98G5n3sLwhYXXkjmdK33L/autofill:label')"/>
    </input>
  </h:body>
</h:html>
`
