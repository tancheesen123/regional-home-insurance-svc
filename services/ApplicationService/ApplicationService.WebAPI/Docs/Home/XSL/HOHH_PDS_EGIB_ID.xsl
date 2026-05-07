<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>

			<head>
				<title></title>
				<style>
					ol {
					margin: 0;
					padding-left: 1.2em;
					}

					ul {
					margin: 0;
					padding-left: 1.2em;
					}

					ol.custom-indent {
					list-style-position: outside;
					padding-left: 2.5em;
					margin: 0;
					}

					ol.custom-indent li {
					text-indent: -1em;
					padding-left: 1em;
					margin-bottom: 0.5em;
					}

					ol.custom-alpha {
					list-style: none;
					counter-reset: item;
					padding-left: 1.5em;
					}

					ol.custom-alpha li {
					counter-increment: item;
					position: relative;
					margin-bottom: 0px;
					}

					ol.custom-alpha li::before {
					content: counter(item, lower-alpha) ") ";
					position: absolute;
					left: -1.5em;
					}

					table {
					border-collapse: separate;
					page-break-inside: auto;
					page-break-after: auto;
					width: 100%;
					}

					tr {
					page-break-inside: avoid;
					page-break-after: auto;
					}
				</style>
			</head>

			<body>
				<table border="0" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
					<tr>
						<td style="height: 50px;
  vertical-align: bottom;">
							<strong style="font-family: Arial; color: #000000; font-size: 20px; font-weight: 700;">
								LEMBAR PENGUNGKAPAN PRODUK
							</strong>
							<br />
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500;">
								<strong>Nasabah yang terhormat,</strong>
								<br />
								Lembar Pengungkapan Produk (LPP) ini dirancang untuk memberikan informasi penting mengenai
								<strong>Asuransi Pemilik/Penyewa Rumah</strong> Anda. Nasabah lain telah membaca LPP ini
								dan merasa terbantu, Anda juga sebaiknya membacanya.
							</span>

						</td>
						<td>
							<img alt="Etiqa Logo" height='160' style="text-align: center;">
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_LogoImage" />
								</xsl:attribute>
							</img>
							<br />
						</td>

					</tr>
					<tr>
						<td>
						</td>
						<td style="font-family: Arial; color: #000000; font-size: 14px; font-weight: 500; text-align: center;">
							<span>
								Tanggal: <xsl:value-of select="root/P_PaymentDate" />
							</span>
						</td>

					</tr>

				</table>


				<img alt="Number1Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number1Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 Apa itu Asuransi Pemilik/Penyewa Rumah?
				</strong>
				<br />
				<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
					Asuransi Pemilik/Penyewa Rumah memberikan perlindungan untuk bangunan (tempat tinggal pribadi) dan
					isi rumah tangga serta barang-barang pribadi di dalam rumah Anda.
				</span>
				<br />
				<br />

				<img alt="Number2Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number2Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 Kenali Perlindungan Anda
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td>
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
								Untuk durasi perlindungan tahunan, Anda akan menerima perlindungan asuransi berikut:
							</span>
							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">No.</th>
									<th style="width: 65%">Jenis Manfaat</th>
									<th style="width: 15%">
										Pemilik Rumah<br />
										(Bangunan)
									</th>
									<th style="width: 15%">
										Penyewa Rumah<br/>
										(Isi Rumah)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">
										Kebakaran, Petir, dan Ledakan yang disebabkan oleh gas untuk
										keperluan rumah tangga
									</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Pesawat udara dan perangkat udara atau benda yang jatuh dari padanya
									</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">Kerusakan akibat benturan kendaraan bermotor atau hewan</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>4.</td>
									<td style="text-align: justify;">
										Pecah atau meluapnya tangki air, alat, atau pipa
									</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>5.</td>
									<td style="text-align: justify;">
										Pencurian dengan cara membobol masuk dan keluar rumah secara paksa dan kekerasan
									</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>6.</td>
									<td style="text-align: justify;">Badai, Siklon, Topan, Angin Kencang</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>7.</td>
									<td style="text-align: justify;">Gempa Bumi atau Letusan Gunung Berapi</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>8.</td>
									<td style="text-align: justify;">Banjir</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>9.</td>
									<td style="text-align: justify;">Kehilangan Sewa - Batas 10% dari Total Uang Pertanggungan</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>10.</td>
									<td style="text-align: justify;">
										Tanggung jawab kepada pihak ketiga atas kecelakaan di rumah Anda
										&#45; Batas Kewajiban hingga IDR 50.000.000
									</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>11.</td>
									<td style="text-align: justify;">
										Isi rumah yang sementara dipindahkan dari rumah &#45; Batas
										15% dari
										total uang pertanggungan isi rumah
									</td>
									<td>Tidak Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>12.</td>
									<td style="text-align: justify;">
										Kerusakan cermin, selain cermin tangan &#45; Batas
										IDR 500.000
										per lembar untuk satu kecelakaan
									</td>
									<td>Tidak Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>13.</td>
									<td style="text-align: justify;">
										Santunan Kematian Tertanggung; akibat kebakaran
										atau perampokan dengan cara membobol masuk rumah secara paksa dan kekerasan &#45; Batas
										IDR 10.000.000
										atau setengah dari Uang Pertanggungan isi rumah mana yang lebih rendah
									</td>
									<td>Tidak Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>14.</td>
									<td style="text-align: justify;">Properti pembantu rumah tangga</td>
									<td>Tidak Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
							</table>
							<br />
							<span style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500;">
								Dengan membayar premi tambahan, Anda dapat memperluas perlindungan untuk mencakup:
							</span>

							<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center;">
								<tr style="background-color: #FFC000;">
									<th style="width: 5%">No.</th>
									<th style="width: 65%">Jenis Manfaat</th>
									<th style="width: 15%">
										Pemilik Rumah<br/>
										(Bangunan)
									</th>
									<th style="width: 15%">
										Penyewa Rumah<br/>
										(Isi Rumah)
									</th>
								</tr>
								<tr>
									<td>1.</td>
									<td style="text-align: justify;">Kerusuhan, Pemogokan, dan Kerusakan Akibat Tindakan Jahat</td>
									<td>Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>2.</td>
									<td style="text-align: justify;">
										Tidak ditempati lebih dari sembilan puluh (90) hari
									</td>
									<td>Tidak Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
								<tr>
									<td>3.</td>
									<td style="text-align: justify;">
										Pencurian tanpa pembobokan paksa dan kekerasan masuk
										dan/atau keluar tidak termasuk pencurian oleh pembantu rumah tangga atau anggota keluarga/rumah tangga
									</td>
									<td>Tidak Ditanggung</td>
									<td>Ditanggung</td>
								</tr>
							</table>

							<br />
							<span>
								<strong>Catatan:</strong>
							</span>
							<div style="text-align: justify">
								<ol>
									<li>Silakan merujuk pada kontrak polis untuk detail lebih lanjut mengenai manfaat di atas.</li>
									<li>
										Durasi perlindungan adalah satu (1) tahun. Anda perlu memperbarui perlindungan asuransi setiap tahun.
									</li>
									<li>
										Manfaat yang dibayarkan berdasarkan produk yang memenuhi syarat dilindungi oleh Perbadanan Insurans Deposit
										Malaysia (PIDM) hingga batas-batas tertentu. Silakan merujuk pada Brosur Sistem Perlindungan Manfaat Takaful dan Asuransi (TIPS) PIDM atau hubungi kami atau PIDM (kunjungi www.pidm.gov.my).
									</li>
								</ol>
							</div>
							<br />

							<span>
								<strong>Polis Anda tidak mencakup kerugian tertentu, seperti:</strong>
							</span>
							<ol>
								<li>Kerugian atau kerusakan akibat penurunan tanah, longsor, kerusuhan, pemogokan, dan kerusakan akibat tindakan jahat;</li>
								<li>
									Kerugian atau kerusakan akibat perang, perang saudara, dan segala tindakan terorisme;
								</li>
								<li>
									Kerugian atau kerusakan pada bangunan jika ditinggalkan selama lebih dari sembilan puluh (90) hari (kecuali diberitahukan secara tertulis kepada kami dan disetujui oleh kami melalui endorsemen yang diterbitkan);
								</li>
								<li>
									Kerugian atau kerusakan akibat risiko radioaktif dan energi nuklir.
								</li>
							</ol>

							<p>
								<strong>Catatan: </strong>Daftar ini tidak lengkap. Silakan merujuk pada kontrak polis untuk
								daftar pengecualian lengkap.
							</p>
						</td>
					</tr>
				</table>
				<br/>

				<!--Page Break-->
				<div style="page-break-after: always"></div>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: center; page-break-inside: avoid;">
					<tr>
						<td colspan="4" style="color: #000000; text-align: justify; vertical-align: top; border: none;">
							Jika Anda memiliki pertanyaan atau memerlukan bantuan mengenai produk asuransi rumah kami, Anda dapat:
						</td>
					</tr>
					<tr>
						<!-- Phone -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Phone" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_PhoneImage" />
								</xsl:attribute>
							</img>
							<br />
							Hubungi kami di 1-300-13-8888
							<br />
							(Etiqa Oneline)
						</td>

						<!-- Website -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Website" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_WebsiteImage" />
								</xsl:attribute>
							</img>
							<br />
							Kunjungi kami di
							<br />
							<xsl:value-of select="root/P_WebsiteUrl" />
						</td>

						<!-- Email -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="Email" height='45'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_EmailImage" />
								</xsl:attribute>
							</img>
							<br />
							Email kami di
							<br />
							info@etiqa.com.my
						</td>

						<!-- QR Code -->
						<td style="width: 25%; text-align: center; border: none;">
							<img alt="QR Code" height='80'>
								<xsl:attribute name="src">
									<xsl:value-of select="root/P_QRCodeImage" />
								</xsl:attribute>
							</img>
							<br />
							Pindai kode QR
						</td>
					</tr>
				</table>

				<br/>

				<img alt="Number3Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number3Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 Kenali Kewajiban Anda
				</strong>
				<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; vertical-align: top;text-align: justify;font-family: Arial, sans-serif; font-size: 14px;">
					<tr>
						<td colspan=" 2">
							<strong>
								Untuk Asuransi Pemilik/Penyewa Rumah ini, premi yang harus Anda bayar setiap tahun dihitung
								berdasarkan uang pertanggungan dan bahaya tambahan yang dipilih, jika ada. Sebagai
								ilustrasi IDR <xsl:value-of select="root/P_CoverageAmount" />
								, Anda harus membayar:
							</strong>
						</td>
					</tr>
					<tr>
						<td>Premi Dasar untuk Perlindungan Standar</td>
						<td>
							IDR <xsl:value-of select="root/P_PlanPremium" />
						</td>
					</tr>
					<xsl:if test="root/P_HasAddOn = 'true'">
						<tr>
							<td>
								Perlindungan Tambahan<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:value-of select="position()" />
									.
									<xsl:value-of select="Name" />
									<br />
								</xsl:for-each>
							</td>
							<td>
								<br />
								<xsl:for-each select="/root/P_AddOn[position() &lt;= 4]">
									<xsl:text>IDR </xsl:text>
									<xsl:value-of select="Premium" />
									<br />
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_HasAddOn = 'false'">
						<tr>
							<td>
								Perlindungan Tambahan<br />
								Tidak Berlaku
							</td>
							<td>
								<br />
								IDR 0.00
							</td>
						</tr>
					</xsl:if>
					<xsl:if test="root/P_IsCommissionAgency = 'false' and root/P_IsCommissionBanca = 'false'">
						<tr>
							<td>(-) Diskon untuk nasabah</td>
							<td>
								<xsl:value-of select="root/P_DiscountRate" />
								% atau IDR <xsl:value-of select="root/P_DiscountAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Total Premi
						</td>
						<td>
							IDR <xsl:value-of select="root/P_NetPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							<strong>Anda juga harus membayar biaya dan pungutan berikut:</strong>
						</td>
					</tr>
					<xsl:if test="root/P_IsCommissionAgency = 'true' or root/P_IsCommissionBanca = 'true'">
						<tr>
							<td>
								Komisi yang Dibayarkan kepada Perantara
							</td>
							<td>
								<xsl:value-of select="root/P_CommissionRate" />
								% atau IDR
								<xsl:value-of select="root/P_CommissionAmount" />
							</td>
						</tr>
					</xsl:if>
					<tr>
						<td>
							Pajak Layanan
						</td>
						<td>
							<xsl:value-of select="root/P_ServiceTaxRate" />
							% dari total premi atau IDR
							<xsl:value-of select="root/P_ServiceTaxAmount" />
						</td>
					</tr>
					<tr>
						<td>Bea Materai</td>
						<td>
							IDR <xsl:value-of select="root/P_StampDuty" />
						</td>
					</tr>
					<tr>
						<td>Total Premi yang Harus Dibayar</td>
						<td>
							IDR <xsl:value-of select="root/P_TotalPremium" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
							Semua premi (jika berlaku) akan dikenakan biaya atau pajak yang relevan sebagaimana dianggap perlu
							oleh otoritas pajak Indonesia. Penting untuk menyimpan setiap tanda terima yang Anda terima sebagai bukti
							pembayaran premi.
						</td>
					</tr>
				</table>
				<br />

				<img alt="Number4Image" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_Number4Image" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					 Ketentuan Penting Lainnya
				</strong>
				<table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px; text-align: justify;">
					<tr >
						<td >
							<div style="text-align: justify">
								<ol >
									<li >
										Anda harus memberikan informasi yang lengkap dan akurat selama proses pengajuan.
									</li>
									<li >
										Perlindungan asuransi hanya efektif setelah Anda membayar premi (Tunai Sebelum Perlindungan).
									</li>
									<li >
										Semua klaim harus diberitahukan kepada kami sesegera mungkin namun tidak lebih dari tiga puluh (30)
										hari setelah kejadian yang mungkin memberikan hak kepada Anda untuk mengajukan klaim berdasarkan polis. Segera kirimkan kepada kami
										semua dokumen yang relevan untuk mendukung klaim Anda. Setiap dokumen atau bukti
										yang kami perlukan untuk memverifikasi klaim harus Anda sediakan atas biaya Anda sendiri.
									</li>
									<li >
										Nilai pasar
										<ol type="i" >
											<li >
												Anda harus memastikan bahwa properti Anda diasuransikan secara memadai setiap saat, dengan
												mempertimbangkan renovasi dan peningkatan yang dilakukan pada properti Anda. Uang pertanggungan
												harus mencakup biaya pembangunan kembali dan penggantian properti Anda dalam
												hal terjadi kerugian atau kerusakan.
											</li>
											<li >
												Untuk membantu Anda menentukan uang pertanggungan, Anda dapat menggunakan kalkulator biaya bangunan
												perkiraan yang disediakan oleh Persatuan Insurans Am Malaysia (PIAM) melalui
												tautan berikut:
												https://bcc.piam.org.my/. Harap
												diperhatikan bahwa Anda disarankan untuk mencari saran profesional independen jika
												properti telah direnovasi secara ekstensif dan/atau memiliki desain yang unik/non-standar.
											</li>
										</ol>
									</li>
									<li >
										Rata-rata &#45; Jika properti yang Anda asuransikan pada saat terjadi kerugian memiliki nilai lebih besar
										dari uang pertanggungan, maka Anda dianggap menanggung sendiri selisihnya, dan
										menanggung proporsi kerugian secara proporsional.
									</li>
									<li >
										Risiko Sendiri &#45; Jumlah kerugian yang harus Anda tanggung dan berlaku untuk bahaya tertentu,
										seperti Meluapnya tangki air, alat, atau pipa, Badai, Siklon, Topan,
										Angin Kencang, Gempa Bumi, Letusan Gunung Berapi, dan Banjir.
									</li>
									<li >
										Perlindungan Isi Rumah &#45; Jika ada barang rumah tangga Anda yang nilainya lebih dari 5% dari
										total uang pertanggungan; Anda disarankan untuk mendeklarasikan barang-barang tersebut secara terpisah.
									</li>
								</ol>
							</div>

							<p style="margin-top: 15px;">
								<strong>Catatan: </strong>Daftar ini tidak lengkap. Silakan merujuk pada kontrak polis untuk daftar lengkap syarat dan ketentuan.
							</p>
						</td>
					</tr>
				</table>
				<br />

				<img alt="Red Question Mark" height='20'>
					<xsl:attribute name="src">
						<xsl:value-of select="root/P_QuestionMarkImage" />
					</xsl:attribute>
				</img>
				<strong style="font-family: Arial; color: #000000; font-size: 20px;  font-weight: 700;">
					Dapatkah saya membatalkan polis saya?
				</strong>
				<br />
				<div style="font-family: Arial; color: #000000; font-size: 14px;  font-weight: 500; text-align: justify;">
					Ya. Anda dapat membatalkan polis Anda kapan saja dengan memberikan pemberitahuan tertulis kepada kami. Pada saat pembatalan, Anda
					berhak mendapatkan pengembalian sebagian premi asalkan Anda belum mengajukan klaim.
				</div>
			</body>

			<footer style="
  position: fixed;
  bottom: 0;
  right: 15px;
  color: gray;
  font-size: 12px;
  background: transparent;
  ">
				PMG/EGIB/HOHH/PDS/ID/2601V0.1
			</footer>

		</html>
	</xsl:template>
</xsl:stylesheet>
