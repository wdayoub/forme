const { parsePrereq } = require('./prereqParser');


const { matchPrereq } = require('./prereqParser');
describe('parsePrereq', () => {
    test('parses standard prerequisite string correctly', () => {
        const prereq = "CIS*1300, MATH*1200";
        expect(parsePrereq(prereq)).toEqual(['CIS*1300', 'MATH*1200']);
    });

    test('handles invalid input', () => {
        const prereq = "UNKNOWN PREREQ";
        expect(parsePrereq(prereq)).toEqual(['UNKNOWN PREREQ']);
    });

    test('X of course,course,course... test', () => {
        const prereq = "2 of CIS*1000,CIS*2000,CIS*3000,CIS*4000";
        expect(parsePrereq(prereq)).toEqual(['2 of CIS*1000,CIS*2000,CIS*3000,CIS*4000']);
    });

    test('combo test', () => {
        const prereq = "CIS*1300,GEOG*2420,(1 of CIS*2200,CIS*2300,CIS*2400),CIS*1910,(CIS*3200 or CIS*3300),(ewe, wwwe)";
        expect(parsePrereq(prereq)).toEqual(['CIS*1300','GEOG*2420','1 of CIS*2200,CIS*2300,CIS*2400','CIS*1910','CIS*3200 or CIS*3300','UNKNOWN PREREQ','UNKNOWN PREREQ']);
    });

    test('including test', () => {
        const prereq = "5.0 credits including CIS*1300";
        expect(parsePrereq(prereq)).toEqual(['5.0 credits','CIS*1300']);
    });

});

//matchprereq tests 
describe('matchPrereq', () => {
    test('returns true when prerequisites are met', () => {
        const coursesTaken = ['CIS*1300', 'MATH*1200'];
        const prereqArray = ['CIS*1300'];
        expect(matchPrereq(coursesTaken, prereqArray)).toBe(true);
    });

    describe('matchPrereq', () => {
        test('returns false for unknown prerequisite', () => {
            expect(matchPrereq(['course1'], ['UNKNOWN PREREQ'])).toBe(false);
        });

        test('returns true when single prerequisite is met', () => {
            expect(matchPrereq(['MATH*1200'], ['MATH*1200'])).toBe(true);
        });

        test('returns false when single prerequisite is not met', () => {
            expect(matchPrereq(['MATH*1200'], ['CIS*2500'])).toBe(false);
        });

        test('handles "X of" prerequisites correctly', () => {
            expect(matchPrereq(['MATH*1200', 'CIS*1300'], ['2 of CIS*1300, MATH*1200, course3'])).toBe(true);
            expect(matchPrereq(['MATH*1200'], ['2 of MATH*1200, CIS*1300, CIS*2500'])).toBe(false);
        });

        test('handles "credits in" prerequisites correctly', () => {
            //fake courseMap for testing
            const courseMap = new Map([
                ['computing and information science', 'cis'],
                ['accounting', 'acct']
            ]);
            global.courseMap = courseMap;


        });



        test('handles "or" prerequisites correctly', () => {
            expect(matchPrereq(['course1'], ['course1 or course2'])).toBe(true);
            expect(matchPrereq(['course3'], ['course1 or course2'])).toBe(false);
        });

        test('handles credit prerequisites correctly', () => {
            expect(matchPrereq(['course1', 'course2', 'course3', 'course4'], ['2.0 credits'])).toBe(true);
            expect(matchPrereq(['course1'], ['2.0 credits'])).toBe(false);
        });


    });
});
