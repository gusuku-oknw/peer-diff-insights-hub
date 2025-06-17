import JSZip from 'jszip';
import { useSlideStore } from '@/stores/slide.store';

export const exportToPPTX = async () => {
  const slides = useSlideStore.getState().slides;

  // Create a new presentation
  const zip = new JSZip();

  // Add the slides
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    // Create a new slide part
    const slidePart = `
      <p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
        <p:cSld>
          <p:spTree>
            <p:nvGrpSpPr>
              <p:cNvPr id="1" name=""/>
              <p:cNvGrpSpPr/>
              <p:nvPr/>
            </p:nvGrpSpPr>
            <p:grpSpPr>
              <a:xfrm>
                <a:off x="0" y="0"/>
                <a:ext cx="0" cy="0"/>
                <a:chOff x="0" y="0"/>
                <a:chExt cx="0" cy="0"/>
              </a:xfrm>
            </p:grpSpPr>
          </p:spTree>
        </p:cSld>
        <p:clrMapOvr>
          <a:masterClrMapping/>
        </p:clrMapOvr>
      </p:sld>
    `;

    // Add the slide part to the zip
    zip.file(`ppt/slides/slide${i + 1}.xml`, slidePart);
  }

  // Create the presentation part
  const presentationPart = `
    <p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1">
      <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
      <p:sldIdLst>
        ${slides.map((_, i) => `<p:sldId id="${i + 256}" r:id="rId${i + 1}"/>`).join('')}
      </p:sldIdLst>
      <p:sldMasterIdLst>
        <p:sldMasterId id="1" r:id="rId1"/>
      </p:sldMasterIdLst>
      <p:notesSz cx="6858000" cy="9144000"/>
      <p:defaultTextStyle>
        <a:lstStyle/>
      </p:defaultTextStyle>
    </p:presentation>
  `;

  // Add the presentation part to the zip
  zip.file('ppt/presentation.xml', presentationPart);

  // Create the slide master part
  const slideMasterPart = `
    <p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
      <p:cSld>
        <p:spTree>
          <p:nvGrpSpPr>
            <p:cNvPr id="1" name=""/>
            <p:cNvGrpSpPr/>
            <p:nvPr/>
          </p:nvGrpSpPr>
          <p:grpSpPr>
            <a:xfrm>
              <a:off x="0" y="0"/>
              <a:ext cx="0" cy="0"/>
              <a:chOff x="0" y="0"/>
              <a:chExt cx="0" cy="0"/>
            </a:xfrm>
          </p:grpSpPr>
        </p:spTree>
      </p:cSld>
      <p:clrMapOvr>
        <a:masterClrMapping/>
      </p:clrMapOvr>
    </p:sldMaster>
  `;

  // Add the slide master part to the zip
  zip.file('ppt/slideMasters/slideMaster1.xml', slideMasterPart);

  // Create the presentation relationships part
  const presentationRelsPart = `
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
      ${slides.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join('')}
    </Relationships>
  `;

  // Add the presentation relationships part to the zip
  zip.file('ppt/_rels/presentation.xml.rels', presentationRelsPart);

  // Create the app properties part
  const appPropsPart = `
    <Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
      <Application>Microsoft Office PowerPoint</Application>
      <DocSecurity>0</DocSecurity>
      <ScaleCrop>false</ScaleCrop>
      <HeadingPairs>
        <vt:vector size="2" baseType="variant" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
          <vt:variant>
            <vt:lpstr>タイトル</vt:lpstr>
          </vt:variant>
          <vt:variant>
            <vt:i4>1</vt:i4>
          </vt:variant>
        </vt:vector>
      </HeadingPairs>
      <TitlesOfParts>
        <vt:vector size="1" baseType="lpstr" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
          <vt:lpstr>PowerPoint スライド</vt:lpstr>
        </vt:vector>
      </TitlesOfParts>
      <Company/>
      <LinksUpToDate>false</LinksUpToDate>
      <SharedDoc>false</SharedDoc>
      <HyperlinksChanged>false</HyperlinksChanged>
      <AppVersion>16.0000</AppVersion>
    </Properties>
  `;

  // Add the app properties part to the zip
  zip.file('docProps/app.xml', appPropsPart);

  // Create the core properties part
  const corePropsPart = `
    <cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <dc:title/>
      <dc:creator>LOV</dc:creator>
      <dcterms:created xsi:type="dcterms:W3CDTF">2024-08-24T00:00:00Z</dcterms:created>
      <dcterms:modified xsi:type="dcterms:W3CDTF">2024-08-24T00:00:00Z</dcterms:modified>
    </cp:coreProperties>
  `;

  // Add the core properties part to the zip
  zip.file('docProps/core.xml', corePropsPart);

  // Create the content types part
  const contentTypesPart = `
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
      <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
      ${slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('')}
      <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
      <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
    </Types>
  `;

  // Add the content types part to the zip
  zip.file('[Content_Types].xml', contentTypesPart);

  // Create the package relationships part
  const packageRelsPart = `
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
      <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
      <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
    </Relationships>
  `;

  // Add the package relationships part to the zip
  zip.file('_rels/.rels', packageRelsPart);

  // Generate the file
  const blob = await zip.generateAsync({ type: 'blob' });

  // Save the file
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'presentation.pptx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
