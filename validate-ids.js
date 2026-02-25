const verifiedFashionIds = [
    '1483985988355-763728e1935b', '1529139574466-a303027c1d8b', '1603189343302-e603f7add05a',
    '1571513800374-df1bbe650e56', '1492707892479-7bc8d5a4ee93', '1490481651871-ab68de25d43d',
    '1509631179647-0177331693ae', '1571513722275-4b41940f54b8', '1445205170230-053b83016050',
    '1596993100471-c3905dafa78e', '1601597565151-70c4020dc0e1', '1626386699888-b8865823b279',
    '1608228088998-57828365d486', '1532453288672-3a27e9be9efd', '1523297467724-f6758d7124c5',
    '1538329972958-465d6d2144ed', '1557022971-af40cfaf8f80', '1495385794356-15371f348c31',
    '1515886657613-9f3515b0c78f', '1601762603339-fd61e28b698a', '1574015974293-817f0ebebb74',
    '1539109136881-3be0616acf4b', '1485518882345-15568b007407', '1608748010899-18f300247112',
    '1562151270-c7d22ceb586a', '1612215327100-60fc5c4d7938', '1603400521630-9f2de124b33b',
    '1588117260148-b47818741c74', '1566206091558-7f218b696731', '1554412933-514a83d2f3c8'
];

async function checkIds() {
    const fails = [];
    const successes = [];
    for (const id of verifiedFashionIds) {
        // Try images domain first
        let url = `https://images.unsplash.com/photo-${id}?w=100`;
        try {
            let resp = await fetch(url, { method: 'HEAD', redirect: 'follow' });
            if (resp.status === 200) {
                successes.push({ id, url: resp.url });
            } else {
                // Try plus domain with premium_photo prefix
                const urlPlus = `https://plus.unsplash.com/premium_photo-${id}?w=100`;
                let resp2 = await fetch(urlPlus, { method: 'HEAD' });
                if (resp2.status === 200) {
                    successes.push({ id, url: resp2.url, type: 'premium' });
                } else {
                    fails.push({ id, status: resp.status, statusPlus: resp2.status });
                }
            }
        } catch (e) {
            fails.push({ id, error: e.message });
        }
    }
    console.log("--- SUCCESSES ---");
    console.log(JSON.stringify(successes, null, 2));
    console.log("--- FAILS ---");
    console.log(JSON.stringify(fails, null, 2));
}

checkIds();
