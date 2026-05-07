<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<head>
				<title></title>
				<style>
					ol { margin: 0; padding-left: 1.2em; }
					ul { margin: 0; padding-left: 1.2em; }
					table { border-collapse: separate; page-break-inside: auto; page-break-after: auto; width: 100%; }
					tr { page-break-inside: avoid; page-break-after: auto; }
				</style>
			</head>
			<body>
				<table border="0" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
					<tr>
						<td style="height: 50px; vertical-align: bottom;">
							<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
								SHEET NG PAGBUBUNYAG NG PRODUKTO
							</strong>
							<br /><br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								<strong>Mahal naming Customer,</strong>
								<br />
								Ang Sheet ng Pagbubunyag ng Produkto (PDS) na ito ay dinisenyo upang magbigay sa inyo ng ilang pangunahing impormasyon tungkol sa
								<strong>Seguro ng May-ari/Nakatira sa Bahay</strong>. Nabasa na ng ibang mga customer ang PDS na ito
								at natuklasan itong kapaki-pakinabang, dapat din itong basahin ng lahat.
							</span>
						</td>
						<td>
							<img alt="Etiqa Logo" height='160' style="text-align: center;">
								<xsl:attribute name="src"><xsl:value-of select="root/P_LogoImage" /></xsl:attribute>
							</img>
						</td>
					</tr>
					<tr>
						<td></td>
						<td style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: center;">
							<span>Petsa: <xsl:value-of select="root/P_PaymentDate" /></span>
						</td>
					</tr>
				</table>

				<img alt="Number1Image" height='20'>
					<xsl:attribute name="src"><xsl:value-of select="root/P_Number1Image" /></xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 Ano ang Seguro ng May-ari/Nakatira sa Bahay?
				</strong>
				<br />
				<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
					Ang Seguro ng May-ari/Nakatira sa Bahay ay nagbibigay ng saklaw para sa inyong gusali (pribadong tirahan) at nilalaman
					ng sambahayan pati na rin ang mga personal na kagamitan sa loob ng inyong bahay.
				</span>
				<br /><br />

				<img alt="Number2Image" height='20'>
					<xsl:attribute name="src"><xsl:value-of select="root/P_Number2Image" /></xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 Alamin ang Inyong mga Saklaw
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td>
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								Para sa tagal ng taunang saklaw, makakatanggap kayo ng mga sumusunod na saklaw ng seguro:
							</span>
							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">Blg.</th>
									<th style="width: 65%">Uri ng Benepisyo</th>
									<th style="width: 15%">May-ari ng Bahay<br />(Gusali)</th>
									<th style="width: 15%">Nakatira sa Bahay<br/>(Nilalaman)</th>
								</tr>
								<tr><td>1.</td><td style="text-align: justify;">Sunog, Kidlat, at Pagsabog na dulot ng gas para sa domestic na gamit</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>2.</td><td style="text-align: justify;">Eroplano at aerial na aparato o mga artikulong nahulog mula rito</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>3.</td><td style="text-align: justify;">Pinsala ng benturan ng mga sasakyan sa kalsada o hayop</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>4.</td><td style="text-align: justify;">Pagputok o pag-apaw ng mga tangke ng tubig, aparato o tubo</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>5.</td><td style="text-align: justify;">Pagnanakaw sa pamamagitan ng aktwal na marahas at makapangyarihang pagpasok at paglabas ng bahay</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>6.</td><td style="text-align: justify;">Bagyo, Siklon, Tipon, Malakas na Hangin</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>7.</td><td style="text-align: justify;">Lindol o Pagsabog ng Bulkan</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>8.</td><td style="text-align: justify;">Baha</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>9.</td><td style="text-align: justify;">Pagkawala ng Renta - Limitasyon 10% ng Kabuuang Halaga ng Seguro</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>10.</td><td style="text-align: justify;">Pananagutan sa mga ikatlong partido para sa mga aksidente sa inyong bahay &#45; Limitasyon ng Pananagutan hanggang PHP50,000</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>11.</td><td style="text-align: justify;">Mga nilalaman na pansamantalang inalis sa bahay &#45; Limitasyon 15% ng kabuuang halaga ng seguro sa nilalaman</td><td>Hindi Saklaw</td><td>Saklaw</td></tr>
								<tr><td>12.</td><td style="text-align: justify;">Pinsala sa mga salamin, maliban sa mga salamin-kamay &#45; Limitasyon PHP500 bawat piraso sa anumang isang aksidente</td><td>Hindi Saklaw</td><td>Saklaw</td></tr>
								<tr><td>13.</td><td style="text-align: justify;">Kompensasyon sa Kamatayan ng Insured na Tao dahil sa sunog o robbery &#45; Limitasyon PHP10,000 o kalahati ng Halaga ng Seguro sa nilalaman alinman ang mas mababa</td><td>Hindi Saklaw</td><td>Saklaw</td></tr>
								<tr><td>14.</td><td style="text-align: justify;">Ari-arian ng domestic helper</td><td>Hindi Saklaw</td><td>Saklaw</td></tr>
							</table>
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								Sa pamamagitan ng pagbabayad ng karagdagang premium, maaari ninyong palawakin ang saklaw upang isama:
							</span>
							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">Blg.</th>
									<th style="width: 65%">Uri ng Benepisyo</th>
									<th style="width: 15%">May-ari ng Bahay<br/>(Gusali)</th>
									<th style="width: 15%">Nakatira sa Bahay<br/>(Nilalaman)</th>
								</tr>
								<tr><td>1.</td><td style="text-align: justify;">Alsa-balutan, Welga at Malisyosong Pinsala</td><td>Saklaw</td><td>Saklaw</td></tr>
								<tr><td>2.</td><td style="text-align: justify;">Hindi tinitirhan nang higit sa siyamnapung (90) araw</td><td>Hindi Saklaw</td><td>Saklaw</td></tr>
								<tr><td>3.</td><td style="text-align: justify;">Pagnanakaw nang walang aktwal na marahas na pagpasok at/o paglabas hindi kasama ang pagnanakaw ng domestic servant o miyembro ng pamilya</td><td>Hindi Saklaw</td><td>Saklaw</td></tr>
							</table>
							<br />
							<span><strong>Tandaan:</strong></span>
							<div style="text-align: justify">
								<ol>
									<li>Mangyaring sumangguni sa kontrata ng patakaran para sa karagdagang detalye ng mga benepisyo sa itaas.</li>
									<li>Ang tagal ng saklaw ay isang (1) taon. Kailangan ninyong i-renew ang saklaw ng seguro taun-taon.</li>
									<li>Ang mga benepisyong babayaran sa ilalim ng karapat-dapat na produkto ay protektado ng Perbadanan Insurans Deposit Malaysia (PIDM) hanggang sa mga limitasyon. Mangyaring sumangguni sa PIDM's TIPS Brochure o makipag-ugnayan sa amin o PIDM (bisitahin ang www.pidm.gov.my).</li>
								</ol>
							</div>
							<br />
							<span><strong>Ang inyong patakaran ay hindi sumasaklaw sa ilang mga pagkawala, tulad ng:</strong></span>
							<ol>
								<li>Pagkawala o pinsala dahil sa subsidence, landslip, alsa-balutan, welga at malisyosong pinsala;</li>
								<li>Pagkawala o pinsala dahil sa digmaan, digmaang sibil at anumang kilos ng terorismo;</li>
								<li>Pagkawala o pinsala sa gusali kung iniwan nang walang tao nang higit sa siyamnapung (90) araw;</li>
								<li>Pagkawala o pinsala dahil sa mga panganib na radioaktibo at nuklear na enerhiya.</li>
							</ol>
							<p><strong>Tandaan: </strong>Hindi kumpletong listahan ito. Mangyaring sumangguni sa kontrata ng patakaran para sa buong listahan ng mga pagbubukod.</p>
						</td>
					</tr>
				</table>
				<br/>
				<div style="page-break-after: always"></div>

				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center; page-break-inside: avoid;">
					<tr>
						<td colspan="4" style="color: #000000; text-align: justify; vertical-align: top; border: none;">
							Kung mayroon kayong mga katanungan o nangangailangan ng tulong sa aming produkto ng home insurance, maaari kayong:
						</td>
					</tr>
					<tr>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Phone" height='45'><xsl:attribute name="src"><xsl:value-of select="root/P_PhoneImage" /></xsl:attribute></img>
							<br />Makipag-ugnayan sa amin sa 1-300-13-8888<br />(Etiqa Oneline)
						</td>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Website" height='45'><xsl:attribute name="src"><xsl:value-of select="root/P_WebsiteImage" /></xsl:attribute></img>
							<br />Bisitahin kami sa<br /><xsl:value-of select="root/P_WebsiteUrl" />
						</td>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Email" height='45'><xsl:attribute name="src"><xsl:value-of select="root/P_EmailImage" /></xsl:attribute></img>
							<br />Mag-email sa amin sa<br />info@etiqa.com.my
						</td>
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="QR Code" height='80'><xsl:attribute name="src"><xsl:value-of select="root/P_QRCodeImage" /></xsl:attribute></img>
							<br />I-scan ang QR code
						</td>
					</tr>
				</table>
				<br/>

				<img alt="Number3Image" height='20'><xsl:attribute name="src"><xsl:value-of select="root/P_Number3Image" /></xsl:attribute></img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 Alamin ang Inyong mga Obligasyon
				</strong>
				<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; vertical-align: top; text-align: justify; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td colspan="2">
							<strong>
								Para sa Seguro ng May-ari/Nakatira sa Bahay na ito, ang premium na kailangan ninyong bayaran taun-taon ay
								kinakalkula batay sa inyong halaga ng seguro at mga napiling karagdagang panganib, kung mayroon. Bilang
								halimbawa ng PHP <xsl:value-of select="root/P_CoverageAmount" />, kailangan ninyong bayaran:
							</strong>
						</td>
					</tr>
					<tr>
						<td>Pangunahing Premium para sa Standard na Saklaw</td>
						<td>PHP <xsl:value-of select="root/P_PlanPremium" /></td>
					</tr>
					<xsl:if test="root/P_HasAddOn = 'true'">
						<tr>
							<td>
								Karagdagang Saklaw<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:value-of select="position()" />. <xsl:value-of select="Name" /><br />
								</xsl:for-each>
							</td>
							<td>
								<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:text>PHP </xsl:text><xsl:value-of select="Premium" /><br />
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_HasAddOn = 'false'">
						<tr>
							<td>Karagdagang Saklaw<br />Hindi Naaangkop</td>
							<td><br />PHP 0.00</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_IsCommissionAgency = 'false' and root/P_IsCommissionBanca = 'false'">
						<tr>
							<td>(-) Diskwento para sa customer</td>
							<td><xsl:value-of select="root/P_DiscountRate" />% o PHP <xsl:value-of select="root/P_DiscountAmount" /></td>
						</tr>
					</xsl:if>
					<tr>
						<td>Kabuuang Premium</td>
						<td>PHP <xsl:value-of select="root/P_NetPremium" /></td>
					</tr>
					<tr>
						<td colspan="2"><strong>Kailangan din ninyong bayaran ang mga sumusunod na bayad at singil:</strong></td>
					</tr>
					<xsl:if test="root/P_IsCommissionAgency = 'true' or root/P_IsCommissionBanca = 'true'">
						<tr>
							<td>Komisyon na Binayad sa Intermediary</td>
							<td><xsl:value-of select="root/P_CommissionRate" />% o PHP <xsl:value-of select="root/P_CommissionAmount" /></td>
						</tr>
					</xsl:if>
					<tr>
						<td>Buwis sa Serbisyo</td>
						<td><xsl:value-of select="root/P_ServiceTaxRate" />% ng kabuuang premium o PHP <xsl:value-of select="root/P_ServiceTaxAmount" /></td>
					</tr>
					<tr>
						<td>Selyo</td>
						<td>PHP <xsl:value-of select="root/P_StampDuty" /></td>
					</tr>
					<tr>
						<td>Kabuuang Premium na Babayaran</td>
						<td>PHP <xsl:value-of select="root/P_TotalPremium" /></td>
					</tr>
					<tr>
						<td colspan="2">
							Lahat ng premium (kung naaangkop) ay sasailalim sa mga kaugnay na bayad o buwis ayon sa pangangailangan
							ng mga awtoridad sa buwis ng Pilipinas. Mahalaga ang pagpapanatili ng anumang resibo na inyong natanggap bilang patunay
							ng pagbabayad ng premium.
						</td>
					</tr>
				</table>
				<br />

				<img alt="Number4Image" height='20'><xsl:attribute name="src"><xsl:value-of select="root/P_Number4Image" /></xsl:attribute></img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					 Iba pang Mahahalagang Tuntunin
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
					<tr>
						<td>
							<div style="text-align: justify">
								<ol>
									<li>Dapat kayong magbigay ng kumpletong at tumpak na impormasyon sa panahon ng aplikasyon.</li>
									<li>Ang saklaw ng seguro ay magiging epektibo lamang kapag nabayaran na ninyo ang premium (Cash Before Cover).</li>
									<li>Lahat ng paghahabol ay dapat ipaalam sa amin nang sa lalong madaling panahon ngunit hindi lalampas sa tatlumpung (30) araw pagkatapos ng anumang pangyayari na maaaring magbigay sa inyo ng karapatang mag-claim sa ilalim ng patakaran.</li>
									<li>Market value
										<ol type="i">
											<li>Dapat ninyong tiyakin na ang inyong ari-arian ay sapat na naseseguro sa lahat ng oras, isinasaalang-alang ang mga renovasyon at pagpapabuti na ginawa sa inyong ari-arian.</li>
											<li>Upang tulungan kayong matukoy ang halaga ng seguro, maaari ninyong gamitin ang tinantyang calculator ng gastos sa gusali na ibinibigay ng Persatuan Insurans Am Malaysia (PIAM) sa pamamagitan ng sumusunod na link: https://bcc.piam.org.my/.</li>
										</ol>
									</li>
									<li>Average &#45; Kung ang inyong insured na ari-arian sa oras ng pagkawala ay may mas malaking halaga kaysa sa halaga ng seguro, kung gayon ay itinuturing kayong nasa sarili ninyong seguro para sa anumang pagkakaiba.</li>
									<li>Mga Sobra &#45; Ang halaga ng pagkawala na kailangan ninyong tanggapin at naaangkop sa ilang mga panganib tulad ng Pag-apaw ng mga tangke ng tubig, aparato o tubo, Bagyo, Siklon, Tipunan, Malakas na Hangin, Lindol, Pagsabog ng Bulkan, at Baha.</li>
									<li>Saklaw sa ilalim ng Nakatira sa Bahay &#45; Kung ang alinman sa inyong mga kagamitan sa sambahayan ay higit sa 5% ng kabuuang halaga ng seguro, inirerekomenda namin na ipaliwanag ang mga aytem na ito nang hiwalay.</li>
								</ol>
							</div>
							<p style="margin-top: 15px;"><strong>Tandaan: </strong>Hindi kumpleto ang listahang ito. Mangyaring sumangguni sa kontrata ng patakaran para sa buong listahan ng mga tuntunin at kondisyon.</p>
						</td>
					</tr>
				</table>
				<br />

				<img alt="Red Question Mark" height='20'><xsl:attribute name="src"><xsl:value-of select="root/P_QuestionMarkImage" /></xsl:attribute></img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
					Maaari ko bang kanselahin ang aking patakaran?
				</strong>
				<br />
				<div style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: justify;">
					Oo. Maaari ninyong kanselahin ang inyong patakaran anumang oras sa pamamagitan ng pagbibigay ng nakasulat na abiso sa amin. Sa pagkakansela, may karapatang makatanggap kayo ng bahagyang refund ng premium basta hindi pa kayo nakapaghain ng paghahabol.
				</div>
			</body>
			<footer style="position: fixed; bottom: 0; right: 15px; color: gray; font-size: 12px; background: transparent;">
				PMG/EGIB/HOHH/PDS/PH/2601V0.1
			</footer>
		</html>
	</xsl:template>
</xsl:stylesheet>
