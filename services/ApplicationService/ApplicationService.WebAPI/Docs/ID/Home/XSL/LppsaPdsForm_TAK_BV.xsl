<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/">
		<html>
			<meta charset="UTF-8" />
			<style></style>

			<body>
				<div style="padding-left: 40px; padding-right: 40px">
					<div style="height: 50px;"></div>
					<div style="height:145px">
						<table>
							<tr style="height:0.2px"></tr>
						</table>
						<img height="140px" style="float:right;">
							<xsl:attribute name="src">
								<xsl:value-of select="root/ImageEgtbBmHeader" />
							</xsl:attribute>
						</img>
					</div>
					<table cellpadding="0" cellspacing="0" border="0"
						style="empty-cells: show; width: 100%; border-collapse: collapse">
						<tr>
							<td width="50%" style="
              pointer-events: auto;
              background-color: #ffc000;
              border: 1px solid #171710;
              padding: 10px;
              text-align: justify;
            ">
								<b style="
                font-family: Arial, Helvetica, sans-serif;
                font-size: 16px;
                line-height: 1.1499023;
              ">HELAIAN PENDEDAHAN PRODUK</b>
							</td>
							<td width="50%" style="
              pointer-events: auto;
              background-color: #ffc000;
              border: 1px solid #171710;
              padding: 10px;
              text-align: justify;
            ">
								<b style="
                font-family: Arial, Helvetica, sans-serif;
                font-size: 16px;
                line-height: 1.1499023;
              ">Etiqa General Takaful Berhad (‘’Kami’’)</b>
							</td>
						</tr>
						<tr>
							<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 10px;
              padding-bottom: 27px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
								Sila baca Helaian Pendedahan Produk ini sebelum anda membuat
								keputusan untuk menyertai <b>Takaful Isi Rumah.</b>
								Pastikan anda juga membaca terma-terma dan syarat-syarat am.
							</td>
							<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
								<b>
									Takaful Isi Rumah
								</b>
								<br />
								<br />
								<b>
									Tarikh : <xsl:value-of select="root/P_Date" />
								</b>
								<br />
								<br />
							</td>
						</tr>
					</table>
				</div>
				<div style="
		padding-left: 40px;
        padding-right: 40px;
        text-align: justify;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.1499023;
      ">
					<p style="margin-block-end: 0px; font-size: 14px;">
						<b>
							<span style="padding-right:5px;">1.</span> Apakah produk ini?
						</b>
						<br />
						<td>
							<p style="margin-block-start: 0px; font-size: 14px;padding-left:20px;">
								Produk ini menawarkan perlindungan kepada kandungan isi rumah serta barangan peribadi di
								dalam rumah anda.
							</p>
						</td>
					</p>

					<p style="margin-block-end: 0px; font-size: 14px;">
						<b>
							<span style="padding-right:5px">2.</span> Apakah konsep-konsep Syariah yang digunapakai?
						</b>
					</p>
					<p style="
              margin-block-end: 0px;
              margin-block-start: 5px;
              padding-left: 20px;
              font-size: 14px;
            ">
						<b>Wakalah</b>
					</p>
					<p style="
          margin-block-start: 0px;
          margin-block-end: 8px;
          font-size: 14px;
          padding-left:20px;
        ">
						Produk ini menggunapakai konsep wakalah (perwakilan), di mana para peserta melantik kami untuk
						bertindak bagi pihak mereka untuk melabur dan menguruskan Dana Takaful Am (Dana). Para peserta juga
						bersetuju untuk memberikan kuasa kepada kami untuk mewakilkan hak, tanggungjawab dan kewajipan
						kepada mana-mana pihak ketiga sebagaimana yang dianggap sesuai oleh kami bagi mencapai objektif
						untuk melabur dan menguruskan Dana tersebut dengan syarat, bagi perwakilan ini, kami akan tetap
						bertanggungjawab terhadap semua hak, tanggungjawab dan kewajipan terhadap para peserta. Sebagai
						ejen, kami berhak menerima fi wakalah sebagai caj perkhidmatan.
					</p>
					<p style="
              margin-block-end: 0px;
              margin-block-start: 5px;
              padding-left: 20px;
              font-size: 14px;
            ">
						<b>Tabarru’</b>
					</p>
					<p style="
          margin-block-start: 0px;
          margin-block-end: 8px;
          font-size: 14px;
          padding-left:20px;
        ">
						Pelan ini juga menggunapakai konsep Tabarru’ (derma), di mana para peserta bersetuju untuk menderma
						atau menyumbang sumbangan mereka kepada Dana bagi tujuan saling membantu dan menolong mana-mana
						peserta lain yang memerlukan bantuan berdasarkan peristiwa yang telah dipersetujui terlebih dahulu.
						Pada akhir setiap tahun kewangan, sebarang lebihan dalam Dana, tolak pembayaran balik defisit
						bersejarah dan peruntukan luar jangka, dan tertakluk kepada polisi lebihan yang diluluskan oleh
						Jawatankuasa Syariah kami, 50% akan dikongsi antara peserta yang sijilnya belum ditamatkan dan yang
						belum membuat tuntutan dalam tahun kewangan, dan 50% kepada kami kerana mengendali dan menguruskan
						Dana, berdasarkan kontrak Ju’alah. Ju’alah ialah kontrak ganjaran yang menentukan pengagihan
						perkongsian lebihan. Jika lebihan itu kurang daripada RM10.00, lebihan itu akan dimasukkan ke dalam
						tabung kebajikan yang akan digunakan sebagai ‘Amal Jariah’ bagi pihak peserta. Tabung kebajikan akan
						diagihkan kepada penerima yang layak sebagaimana yang diluluskan oleh Jawatankuasa Syariah kami
						untuk tujuan kebajikan.

					</p>

					<p style="margin-block-end: 0px; font-size: 14px;">
						<b>
							<span style="padding-right:5px">3.</span> Apakah jenis-jenis perlindungan/manfaat yang diberi?
						</b>
					</p>
					<span style="font-size: 14px;padding-left:20px;">
						Jenis-jenis manfaat adalah seperti berikut:
					</span>
					<br />
					<div style="padding-left: 20px; padding-right: 0px">
						<table cellpadding="0" cellspacing="0" border="0"
							style="empty-cells: show; width: 100%; border-collapse: collapse;">
							<tr>
								<td width="100%" style="
              pointer-events: auto;
              background-color: #ffc000;
              border: 1px solid #171710;
              text-align: center;
            ">
									<b style="
                font-family: Arial, Helvetica, sans-serif;
                font-size: 16px;
                line-height: 1.1499023;
              ">Jenis Manfaat</b>
								</td>
							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Kebakaran, kilat dan letupan yang disebabkan oleh gas yang digunakan untuk tujuan
									domestik
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Pesawat udara dan/atau peranti udara yang gugur daripadanya
								</td>
							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Hentaman oleh sebarang kenderaan atau haiwan
								</td>
							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Pecahan atau limpahan tangki air domestik atau paip
								</td>
							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Kecurian dengan pemecahan menggunakan kekerasan dan keganasan ke dalam dan keluar
									dari rumah
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Ribut, puting beliung dan angin taufan
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Gempa bumi dan letusan gunung berapi
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Banjir
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Kerugian sewa (Had 10% daripada Jumlah Dilindungi)
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Liabiliti pihak ketiga untuk kemalangan di dalam rumah anda – had limit sehingga
									RM50,000
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Harta yang dipindahkan sementara - sehingga 15% daripada jumlah dilindungi pada
									kandungan rumah
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Kerosakan kepada cermin, selain dari cermin tangan - sehingga RM500 setiap keping untuk
									setiap kemalangan
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Pampasan Kematian Peserta, disebabkan oleh kebakaran atau rompakan di mana terdapat
									kemasukan ganas dan secara paksa ke rumah - Had RM10,000 atau satu perdua daripada
									Keseluruhan Jumlah Dilindungi ke atas kandungan yang mana lebih rendah
								</td>

							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Harta orang gaji
								</td>
							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Rusuhan, mogok dan kerosakan akibat keganasan
								</td>
							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Penenggelaman dan gelinciran tanah
								</td>
							</tr>
							<tr>
								<td style="
              pointer-events: auto;
              text-indent: 0px;
              border: 1px solid #171710;
              padding: 5px 10px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 14px;
              line-height: 1.1499023;
            ">
									Kerosakan oleh pokok tumbang atau dahan atau objek daripadanya
								</td>
							</tr>
						</table>
					</div>

					<div>
						<table style="empty-cells: show; width: 100%; border-collapse: collapse">
							<tr>
								<td width="50%"></td>
								<td width="50%">
									<div style="
                  display: flex;
                  justify-content: space-between;
                  font-size: 14px;
                  padding-top: 140px;
                ">
										<p style="text-align: left">1</p>
										<p style="text-align: right">
											PMG/EGTB/HH(LPPSA)/PDS/BM/2403V1.1
										</p>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>

				<div style="page-break-after: always"></div>
				<div style="height: 50px;"></div>
				<div
					style="font-family: Arial, Helvetica, sans-serif; line-height: 1.1499023; padding-left: 40px; padding-right: 40px; font-size: 14px">

					<p
						style="padding-bottom: 5pt;margin-bottom: 0;text-indent: 0pt;text-align: left; margin-left:20px;">
						Anda boleh memperluaskan perlindungan dengan membayar sumbangan tambahan:
					</p>
					<div style="padding-left: 20px;">
						<table cellpadding="0" cellspacing="0" border="0"
							style="empty-cells: show; width: 100%; border-collapse: collapse; box-sizing: border-box;">
							<tr>
								<td width="70%" style="
                pointer-events: auto;
                background-color: #ffc000;
                border: 1px solid #171710;
                text-align: center;
                ">
									<b style="
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                    line-height: 1.1499023;
                ">Jenis Manfaat</b>
								</td>

							</tr>
							<tr>
								<td style="
                pointer-events: auto;
                text-indent: 0px;
                border: 1px solid #171710;
                padding: 5px 10px;
                text-align: justify;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                line-height: 1.1499023;
                ">
									Meningkatkan had liabiliti kepada Awam sehingga had maksimum RM250,000
								</td>

							</tr>
							<tr>
								<td style="
                pointer-events: auto;
                text-indent: 0px;
                border: 1px solid #171710;
                padding: 5px 10px;
                text-align: justify;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                line-height: 1.1499023;
                ">
									Meningkatkan had kerugian sewa
								</td>
							</tr>
							<tr>
								<td style="
                pointer-events: auto;
                text-indent: 0px;
                border: 1px solid #171710;
                padding: 5px 10px;
                text-align: justify;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                line-height: 1.1499023;
                ">
									Ditinggalkan tidak berpenghuni untuk lebih dari 90 hari
								</td>
							</tr>
							<tr>
								<td style="
                pointer-events: auto;
                text-indent: 0px;
                border: 1px solid #171710;
                padding: 5px 10px;
                text-align: justify;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 14px;
                line-height: 1.1499023;
                ">
									Kerugian akibat kecurian tanpa pemecahan masuk dan/atau keluar rumah menggunakan
									kekerasan dan keganasan sebenar tidak termasuk kecurian oleh orang gaji atau
									ahli keluarga
								</td>

							</tr>
						</table>
					</div>
					<p style="
          font-weight: bold;
          margin-block-start: 0px;
          margin-block-end: 5px;
          font-size: 14px;
          padding-top:10px;
          padding-left:20px
        ">
						<b>
							Nota:
						</b>
					</p>
					<ol type="1" style="
              margin-block-start: 2px;
              padding-inline-start: 43px;
              margin-block-end: 5px;
              font-size: 14px;
              text-align: justify;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.1499023;
            ">
						<li>
							Tempoh Takaful adalah satu satu tahun. Anda perlu memperbaharui sijil takaful setiap
							tahun.
						</li>
						<li>
							Sila rujuk sijil takaful untuk maklumat lanjut berkenaan manfaat- manfaat di atas.
						</li>
						<li>
							Manfaat-manfaat yang dibayar di bawah produk yang layak adalah dilindungi oleh
							Perbadanan Insurans Deposit Malaysia (PIDM) sehingga
							had perlindungan. Sila rujuk Brosur Sistem Perlindungan Manfaat Takaful dan Insurans
							PIDM atau hubungi kami atau PIDM (layari <a
                                        style="cursor: pointer; color: black; text-decoration: none"
                                        href="https://www.pidm.gov.my">www.pidm.gov.my</a>).
						</li>
					</ol>
					<p style="margin-block-end: 0px; font-size: 14px;">
						<b>
							<span style="padding-right:5px">4.</span> Berapakah jumlah sumbangan yang perlu saya
							bayar?
						</b>
					</p>
					<p style="
          margin-block-start: 0px;
          margin-block-end: 8px;
          font-size: 14px;
          padding-left:20px;
          text-align: justify;
        ">
						Jumlah sumbangan tahunan yang perlu anda bayar adalah dikira berdasarkan jumlah
						perlindungan dan perlindungan tambahan, jika ada.
					</p>
					<p style="padding-left:20px">
						<table cellpadding="0" cellspacing="0" border="0"
							style="width: 80%; border-collapse: collapse; font-size: 14px">
							<tr style="font-size: 14px">
								<th rowspan="2" style="
pointer-events: auto;
background-color: #ffc000;
border: 1px solid #171710;
text-align: center;
padding: 2px 10px;;
">Pelan</th>
								<th rowspan="2" style="
pointer-events: auto;
background-color: #ffc000;
border: 1px solid #171710;
text-align: center;
padding: 2px 10px;;
">Jumlah Dilindungi (RM)</th>
								<th colspan="3" style="
pointer-events: auto;
background-color: #ffc000;
border: 1px solid #171710;
text-align: center;
padding: 2px 10px;;
">Sumbangan Asas Mengikut Kelas Pembinaan (RM)</th>

							</tr>
							<tr style="font-size: 14px">
								<th style="
pointer-events: auto;
background-color: #ffc000;
border: 1px solid #171710;
text-align: center;
padding: 2px 10px;;
">Kelas 1A</th>
								<th style="
pointer-events: auto;
background-color: #ffc000;
border: 1px solid #171710;
text-align: center;
padding: 2px 10px;;
">Kelas 1B</th>
								<th style="
pointer-events: auto;
background-color: #ffc000;
border: 1px solid #171710;
text-align: center;
padding: 2px 10px;;
">Kelas 2</th>
							</tr>
							<tr style="
      border: 1px solid #171710;
      text-align: center;
font-size: 14px;
padding: 2px 10px;;
    ">
								<td style="
          border: 1px solid #171710;
          text-align: center;
font-size: 14px;
        ">A</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
font-size: 14px;
padding: 2px 10px;;
        ">20,000</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
font-size: 14px;
padding: 2px 10px;;
        ">87.80</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
font-size: 14px;
padding: 2px 10px;;
        ">124.20</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
font-size: 14px;
padding: 2px 10px;;
        ">150.20</td>
							</tr>
							<tr style="
  border: 1px solid #171710;
  text-align: center;
  font-size: 14px;
padding: 2px 10px;;
">
								<td style="
          border: 1px solid #171710;
          text-align: center;
          padding: 2px 10px;;
        ">B</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
          padding: 2px 10px;;
        ">30,000</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
          padding: 2px 10px;;
        ">131.70</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
          padding: 2px 10px;;
        ">186.30</td>
								<td style="
          border: 1px solid #171710;
          text-align: center;
          padding: 2px 10px;;
        ">225.30</td>
							</tr>
							<tr style="
border: 1px solid #171710;
text-align: center;
font-size: 14px;
">
								<td style="
              border: 1px solid #171710;
              text-align: center;
              padding: 2px 10px;;
            ">C</td>
								<td style="
              border: 1px solid #171710;
              text-align: center;
              padding: 2px 10px;;
            ">30,001 sehingga 200,000</td>
								<td style="
              border: 1px solid #171710;
              text-align: center;
              padding: 2px 10px;;
            " colspan="3">Berdasarkan Jumlah Dilindungi</td>
							</tr>
						</table>
					</p>
					<p style="
          margin-block-start: 0px;
          margin-block-end: 8px;
          font-size: 14px;
          padding-left:20px;
            text-align: justify;
        ">

						Semua sumbangan (jika terpakai) akan tertakluk kepada caj-caj atau cukai-cukai yang
						berkenaan, sebagaimana yang dianggap perlu oleh pihak berkuasa cukai Malaysia. Adalah
						penting untuk anda menyimpan apa-apa resit yang anda terima sebagai bukti pembayaran
						sumbangan.
					</p>
					<p style="margin-block-end: 0px; font-size: 14px;">
						<b>
							<span style="padding-right:5px">5.</span> Apakah fi dan caj yang saya perlu
							bayar?
						</b>
					</p>
					<table cellpadding="0" cellspacing="0" border="0" style="margin-left: 20px; font-size: 14px;width:65%;
                                margin-top: 5px;border-collapse: collapse">
						<tr>
							<td width="50%" style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  text-align: center;
                  border: 1px solid #171710;
                  font-size: 14px;
                ">
								<b>Jenis</b>
							</td>
							<td width="50%" style="
                  pointer-events: auto;
                  background-color: #ffc000;
                  text-align: center;
                  border: 1px solid #171710;
                  font-size: 14px;
                ">
								<b>Amaun</b>
							</td>
						</tr>

						<tr>
							<td style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 2px 10px;;
                ">
								Fi Wakalah
							</td>
							<td style="border: 1px solid #171710;text-align: left; padding: 2px 10px;;">
								<p style="margin: 0 0 6px 0;">
									40% daripada sumbangan termasuk:
								</p>
								<ul style="margin: 0; padding-left: 20px;">
									<li>15% Komisen dibayar kepada pengantara</li>
									<li>25% Perbelanjaan pengurusan</li>
								</ul>
							</td>
						</tr>

						<tr>
							<td style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 2px 10px;;
                ">
								Cukai Perkhidmatan
							</td>
							<td style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  text-align: left;
                  padding: 2px 10px;;
                ">
								8% daripada sumbangan
							</td>
						</tr>

						<tr>
							<td style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  padding: 2px 10px;;
                ">
								Duti Setem
							</td>
							<td style="
                  pointer-events: auto;
                  text-indent: 0px;
                  border: 1px solid #171710;
                  text-align: left;
                  padding: 2px 10px;;
                ">
								RM10.00
							</td>
						</tr>
					</table>
					<div style="
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          ">
						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right:5px">6.</span> Apakah terma-terma dan syarat-syarat
								penting yang harus saya ambil perhatian?

							</b>
						</p>
						<span style="padding-left: 21px; font-size: 14px">
							<b>Kepentingan pendedahan</b>
						</span>
						<ol type="a" style="
              margin-block-start: 2px;
              padding-inline-start: 37px;
              margin-block-end: 8px;
              font-size: 14px
            ">
							<li>
								Menurut Perenggan 5 daripada Jadual 9 Akta Perkhidmatan Kewangan Islam 2013, jika
								anda memohon takaful ini sepenuhnya untuk tujuan yang tidak berkaitan perdagangan,
								perniagaan atau profesion anda, anda mempunyai kewajipan untuk mengambil langkah
								yang munasabah untuk tidak salah nyata dalam menjawab soalan-soalan di dalam Borang
								Permohonan (atau semasa memohon takaful ini). Anda dikehendaki menjawab
								soalan-soalan dalam Borang Permohonan ini dengan lengkap dan tepat.

							</li>
							<li>
								Kegagalan untuk mengambil langkah yang munasabah dalam menjawab soalan-soalan,
								mungkin mengakibatkan pembatalan kontrak takaful anda, keengganan atau pengurangan
								gantirugi, perubahan terma atau penamatan kontrak takaful anda.
							</li>
							<li>
								Kewajipan pendedahan diatas hendaklah diteruskan sehingga kontrak takaful anda
								dimeterai, diubah atau diperbaharui dengan kami.
							</li>
							<li>
								Sebagai tambahan kepada soalan-soalan di dalam Borang Permohonan (atau semasa
								memohon takaful ini), anda dikehendaki untuk mendedahkan apa-apa perkara lain yang
								anda tahu akan mempengaruhi keputusan kami dalam menerima risiko dan menentukan
								kadar dan terma yang dikenakan.
							</li>
							<li>
								Anda juga mempunyai kewajipan untuk memberitahu kami dengan serta-merta jika pada
								bila-bila masa selepas kontrak takaful anda ditandatangani, diubah atau diperbaharui
								dengan kami (atau semasa permohonan takaful ini), apa-apa maklumat yang dinyatakan
								dalam Borang Permohonan tidak tepat atau sudah berubah.
							</li>
						</ol>


						<p style="
              margin-block-end: 0px;
              margin-block-start: 5px;
              padding-left: 21px;
              font-size: 14px;
            ">
							<b>Kandungan Isi Rumah</b> – Setiap barangan (tidak termasuk perabot, piano, organ,
							perkakas rumah, radio, set televisyen, set perakam video, hi-fi dan seumpamanya)
							hendaklah tidak melebihi 5% daripada jumlah yang dilindungi kecuali barang sedemikian
							telah secara khusus diisytiharkan sebagai butiran yang berasingan.
						</p>
						<p style="
              margin-block-end: 0px;
              margin-block-start: 5px;
              padding-left: 21px;
              font-size: 14px;
            ">
							<b>Perlindungan Terhad</b> – Jumlah nilai platinum, emas dan perak, logam berharga dan
							batu, barang kemas, jam tangan dan bulu binatang hendaklah dianggap tidak melebihi satu
							pertiga (1/3) daripada jumlah perlindungan ke atas isi rumah.

						</p>
						<p style="
              margin-block-end: 0px;
              margin-block-start: 5px;
              padding-left: 21px;
              font-size: 14px;
            ">
							<b>Tuntutan</b> – Jika berlaku kemalangan yang membawa kepada tuntutan, anda hendaklah
							memberitahu kami dalam masa 30 hari dari tarikh kemalangan itu berlaku.

						</p>
						<p style="
              margin-block-end: 0px;
              margin-block-start: 5px;
              padding-left: 21px;
              font-size: 14px;
            ">
							<b>Nota:</b> Senarai ini adalah tidak menyeluruh. Sila rujuk sijil takaful untuk melihat
							keseluruhan terma dan syarat.
						</p>

						<p style="margin-block-end: 0px; font-size: 14px">
							<b>
								<span style="padding-right:5px">7.</span> Apakah pengecualian-pengecualian utama di
								bawah sijil ini?
							</b>
						</p>
						<span style="padding-left: 21px; font-size: 14px">
							Sijil ini tidak melindungi kerugian tertentu seperti:
						</span>
						<ol type="a" style="
              margin-block-start: 2px;
              padding-inline-start: 35px;
              margin-block-end: 8px;
              font-size: 14px
            ">
							<li>
								Kerugian atau kerosakan disebabkan oleh peperangan atau risiko seumpamanya;
							</li>
							<li>
								Kerugian atau kerosakan disebabkan oleh pencemaran radioaktif, radiasi nuklear atau
								risiko seumpamanya;
							</li>
							<li>
								Jika rumah anda dibiarkan kosong lebih daripada 90 hari.
							</li>
						</ol>

						<p style="
              margin-block-end: 0px;
              margin-block-start: 5px;
              padding-left: 21px;
              font-size: 14px;
            ">
							<b>Nota:</b> Senarai ini tidak menyeluruh. Sila rujuk sijil takaful untuk senarai penuh
							pengecualian di bawah sijil ini
						</p>

						<div>
							<table style="empty-cells: show; width: 100%; border-collapse: collapse">
								<tr>
									<td width="50%"></td>
									<td width="50%">
										<div style="
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                  	padding-top: 120px;
                    ">
											<p style="text-align: left">2</p>
											<p style="text-align: right">
												PMG/EGTB/HH(LPPSA)/PDS/BM/2403V1.1
											</p>
										</div>
									</td>
								</tr>
							</table>
						</div>

					</div>
				</div>

				<div style="page-break-after: always"></div>
				<div style="height: 50px;"></div>
				<div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.1499023">
					<div style="
            padding-left: 40px;
            padding-right: 40px;
            text-align: justify;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.1499023;
          ">
						<p style="margin-block-end: 0px; font-size: 14px">
							<p style="margin-block-end: 0px; font-size: 14px">
								<b>
									<span style="padding-right:5px">8.</span> Bolehkah saya membatalkan sijil saya?
								</b>
							</p>
							<p style="
        padding-left: 21px;
        margin-block-end: 0px;
        margin-block-start: 0px;
        font-size: 14px
    ">
								Anda boleh membatalkan sijil dengan memberi notis bertulis kepada kami. Selepas
								pembatalan, anda layak mendapat pemulangan
								sebahagian daripada sumbangan dengan syarat anda tidak membuat sebarang tuntutan
								sepanjang tempoh takaful.

							</p>
							<p style="margin-block-end: 0px; font-size: 14px">
								<b>
									<span style="padding-right:5px">9.</span> Apa yang patut saya buat sekiranya ada perubahan
									maklumat?
								</b>
							</p>
							<p style="
              padding-left: 21px;
              margin-block-end: 0px;
              margin-block-start: 0px;
              font-size: 14px
            ">
								Adalah penting untuk anda memaklumkan kepada kami tentang sebarang perubahan maklumat
								perhubungan bagi memastikan semua
								komunikasi sampai kepada anda tepat pada masanya.
							</p>

							<p style="margin-block-end: 0px; font-size: 14px">
								<b>
									<span style="padding-right:5px">10.</span> Di manakah saya boleh mendapatkan maklumat
									lanjut?
								</b>
							</p>
							<div
								style="padding-left: 21px; margin-block-end: 0px; margin-block-start: 0px; font-size: 14px; padding-bottom: 10px">

								<table style="empty-cells: show; width: 100%; border-collapse: collapse">
									<tr>
										<td width="50%" style="vertical-align: top;">
											<div style="font-size: 14px; padding-top: 1px;">
												<p>Sekiranya anda mempunyai sebarang pertanyaan, sila hubungi kami di:</p>
												<div>
													<strong>Etiqa General Takaful Berhad (201701025031)</strong>
												</div>
												<div>
													(Dilesenkan di bawah Akta Perkhidmatan Kewangan Islam 2013 dan dikawalselia
													oleh Bank Negara Malaysia)
												</div>
												<div>Aras 13, Menara B, Dataran Maybank</div>
												<div>No. 1, Jalan Maarof</div>
												<div>59000 Kuala Lumpur, Malaysia.</div>
												<div>Nombor Telefon: +603 2297 3888</div>
												<div>Nombor Faksimile: +603 2297 3800</div>
												<div>
													E-mel: <a style="color:black; text-decoration: none;"
			  href="mailto:info@etiqa.com.my">info@etiqa.com.my</a>
												</div>
												<div>
													Laman Web: <a style="color:black; text-decoration: none;"
 href="http://www.etiqa.com.my" target="_blank">www.etiqa.com.my</a>
												</div>
												<div>Etiqa Oneline: 1300 13 8888</div>
											</div>
										</td>
										<td width="50%" style="vertical-align: top;">
											<div style="font-size: 14px; padding-left: 10px; padding-top: 1px;">
												<p>Atau, anda boleh hubungi:</p>
												<div>Pegawai LPPSA</div>
												<div>Nama: Zuraini Mas Ayu</div>
												<div>E-mel: nonmotor.gta@etiqa.com.my</div>
												<div>Nombor Telefon: +603 8861 6772</div>
												<div>Nombor Faksimile: +603 8861 6782</div>
											</div>
										</td>
									</tr>
								</table>
							</div>
							<b style="margin-block-end: 0px; font-size: 14px">
								<span>11.</span> Lain-lain jenis perlindungan seumpama yang boleh didapati
							</b>
						</p>

						<p style="
          margin-block-start: 0px;
          margin-block-end: 8px;
          font-size: 14px;
          padding-left:25px;
        ">
							Takaful Kebakaran.
						</p>

						<div style="padding-left: 20px">
							<table width="100%">
								<td style="
              border: 1px solid #171710;
              padding: 2px 10px;;
              text-align: justify;
              font-size: 14px;
            ">
									<b>
										NOTA PENTING: <br />
										ANDA PERLU MEMASTIKAN HARTA ANDA DILINDUNGI DENGAN NILAI YANG BERPATUTAN. ANDA HARUS
										BACA DAN FAHAMI KANDUNGAN SIJIL TAKAFUL DAN BERBINCANG DENGAN PENGANTARA ANDA ATAU
										HUBUNGI KAMI UNTUK MAKLUMAT LANJUT.
									</b>
								</td>
							</table>
							<p style="
            margin-block-start: 0px;
            margin-block-end: 0px;
            font-size: 14px
          ">
								Maklumat yang terkandung dalam helaian pendedahan ini adalah sah pada
								<xsl:value-of select="root/P_Date" />
							</p>
						</div>
						<table style="empty-cells: show; width: 100%; border-collapse: collapse; margin-top: 792px;">
							<tr>
								<td width="50%"></td>
								<td width="50%">
									<div style="
                      display: flex;
                      justify-content: space-between;
                      font-size: 14px;
                    ">
										<p style="text-align: left">3</p>
										<p style="text-align: right">
											PMG/EGTB/HH(LPPSA)/PDS/BM/2403V1.1
										</p>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</body>

		</html>
	</xsl:template>
</xsl:stylesheet>